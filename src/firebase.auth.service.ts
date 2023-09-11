import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthService {
    async verifySessionToken(token: string): Promise<{ isValid: boolean; email?: string }> {
        try {
            // Search the Realtime Database for the session token
            const userRef = admin.database().ref('users');
            const snapshot = await userRef.orderByChild('sessionToken').equalTo(token).once('value');

            if (!snapshot.exists()) {
                console.log('!snapshot.exists()')
                return { isValid: false };
            }

            // Get the user matching the session token
            const userData = snapshot.val();
            const userId = Object.keys(userData)[0];
            const userEmail = userData[userId].userData.email;

            if (!userEmail) {
                return { isValid: false };
            }

            return { isValid: true, email: userEmail };
        } catch (error) {
            return { isValid: false };
        }
    }
}