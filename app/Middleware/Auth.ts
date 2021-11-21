import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';

export default class Auth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const key = request.header('x-access-key');
    const query = await Database.from('keys').select('*').where({ key, status: 'active' });
    if (query.length !== 0) {
      await next();
    }
  }
}
