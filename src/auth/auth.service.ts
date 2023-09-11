import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegistrationDto, UserDto } from './dto/auth.dto';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    private db: admin.database.Database;

    constructor() {
        this.db = admin.database();
    }

    async register(registerData: RegistrationDto): Promise<UserDto> {
        try {
            const emailEncoded = Buffer.from(registerData.email).toString('base64');

            if (await this.isEmailExists(registerData.email)) {
                throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
            }

            const hashedPassword = await bcrypt.hash(registerData.password, 10);

            const userRef = this.db.ref(`users/${emailEncoded}/userData`);

            const userData = {
                id: uuidv4(),
                email: registerData.email,
                password: hashedPassword,
            };

            await userRef.set(userData);

            return {
                id: userData.id,
                email: userData.email
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Registration Failed', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async login(loginData: RegistrationDto): Promise<{ token: string }> {
        try {
            if (!await this.isEmailExists(loginData.email)) {
                throw new HttpException('User does not exist. Please register first.', HttpStatus.BAD_REQUEST);
            }
            if (!await this.isValidEmailAndPassword(loginData)) {
                throw new HttpException('Invalid credentials. Please check your email and password.', HttpStatus.UNAUTHORIZED);
            }

            //Generate token for the user using firebase
            const token = await admin.auth().createCustomToken(loginData.email);

            // Save the custom token in the Realtime Database for demo purposes only. Not best practice
            const emailEncoded = Buffer.from(loginData.email).toString('base64');
            const userRef = this.db.ref(`users/${emailEncoded}`);
            await userRef.update({ sessionToken: token });

            return { token };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Login Failed', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    private async isEmailExists(email: string): Promise<boolean> {
        const emailEncoded = Buffer.from(email).toString('base64');
        const userRef = this.db.ref(`users/${emailEncoded}`);
        const snapshot = await userRef.once('value');
        return snapshot.exists();
    }

    private async isValidEmailAndPassword(loginData: RegistrationDto): Promise<Boolean> {
        const emailEncoded = Buffer.from(loginData.email).toString('base64');
        const userRef = this.db.ref(`users/${emailEncoded}`);
        const snapshot = await userRef.once('value');
        const snapshotVal = snapshot.val();

        if (!snapshotVal) {
            throw new HttpException('User does not exist. Please register first.', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = snapshotVal.userData.password;
        return await bcrypt.compare(loginData.password, hashedPassword);
    }
}
