import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class RequestLogger {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    console.log(`${request.completeUrl(true)} - ${request.method()} - ${request.ip()} - ${Date()}`);
    await next();
  }
}
