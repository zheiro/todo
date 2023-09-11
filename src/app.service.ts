import { Injectable, Req } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcomeMessage(@Req() request): string {
    const currentUrl = `${request.protocol}://${request.get('host')}`;
    const apiDocumentationUrl = `${currentUrl}/api`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Welcome to My Todo App</title>
        </head>
        <body>
          <h1>Welcome to My Todo App</h1>
          <p>
            This is a simple CRUD application built with Nest.js and Firebase Realtime Database.
          </p>
          <p>
            For more information, please refer to the API documentation:
          </p>
          <a href="${apiDocumentationUrl}">API Documentation</a>
        </body>
      </html>
    `;
  }
}