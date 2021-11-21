import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';

export default class PizzasController {
  public async index(ctx: HttpContextContract) {
    try {
      return Database.from('pizza').select('*');
    } catch (error) {
      ctx.response.status(500);
      if (error.message) return error.message;
      else return error;
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const body = request.body();
      let query = await Database.table('pizza').insert({
        Name: body.Name || body.name,
        Price: body.price || body.Price,
      });
      if (query.length !== 0) {
        response.status(200);
        response.send({ message: 'success' });
      } else {
        throw new Error('failed');
      }
    } catch (error) {
      console.log(error);
      response.status(500);
      if (error.message) return error.message;
      else return error;
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const id = params.id;
      return Database.from('pizza').select('*').where({ idPizza: id });
    } catch (error) {
      console.log(error);
      response.status(500);
      if (error.message) return error.message;
      else return error;
    }
  }

  public async update({ params, response, request }: HttpContextContract) {
    try {
      const id = params.id;
      const body = request.body();
      return Database.rawQuery('UPDATE pizza SET ? WHERE idPizza = ?', [body, id]);
    } catch (error) {
      console.log(error);
      response.status(500);
      if (error.message) return error.message;
      else return error;
    }
  }

  public async destroy() {
    return 'restricted';
  }
}
