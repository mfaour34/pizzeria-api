import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';

export default class OrdersController {
  public async index(ctx: HttpContextContract) {
    try {
      let query = await Database.rawQuery(
        'SELECT pizzeria.order.*,order_items.quantity,pizza.idPizza,pizza.Name,pizza.Price FROM pizzeria.order JOIN order_items ON pizzeria.order.idOrder = order_items.order JOIN pizza ON order_items.item = pizza.idPizza;'
      );
      let prevId = null;
      let res: any[] = [{}];
      if (query[0]) {
        if (query[0][0]) {
          //init first element of response
          prevId = query[0][0].idorder;
          let index = 0;
          res[index] = { items: [], total: 0, idorder: prevId, timestamp: query[0][0].timestamp };
          query[0].forEach((item) => {
            if (item.idorder !== prevId) {
              index++;
              //track last order id
              prevId = item.idorder;
              res[index] = {
                items: [],
                total: 0,
                idorder: item.idorder,
                timestamp: item.timestamp,
              };
            }
            delete item.idorder;
            delete item.timestamp;
            res[index].items.push(item);
            res[index].total += item.Price;
          });
          return res;
        } else throw new Error('no elements found');
      } else throw new Error('error fetching data');
    } catch (error) {
      console.log(error);
      ctx.response.status(500);
      if (error.message) return error.message;
      else return error;
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const body = request.body();
      const items = body.items;
      items.forEach((item) => {
        if (item.quantity < 1) throw new Error('invalid quantity value');
      });
      let query = await Database.table('order').insert({});
      items.forEach((item) => {
        item.order = query[0];
      });
      query = await Database.table('order_items').multiInsert(items);
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
      let query = await Database.rawQuery(
        'SELECT pizzeria.order.*,order_items.quantity,pizza.idPizza,pizza.Name,pizza.Price FROM pizzeria.order JOIN order_items ON pizzeria.order.idOrder = order_items.order JOIN pizza ON order_items.item = pizza.idPizza WHERE pizzeria.order.idOrder = ?',
        [id]
      );
      if (query[0]) {
        let res = {
          idOrder: query[0][0].idorder,
          timestamp: query[0][0].timestamp,
          items: Array<Object>(),
          total: 0,
        };
        query[0].forEach((item) => {
          delete item.idorder;
          delete item.timestamp;
          res.items.push(item);
          res.total += item.Price;
        });
        return res;
      } else throw new Error('error fetching data');
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
      return Database.rawQuery(
        'UPDATE pizzeria.order JOIN order_items ON pizzeria.order.idOrder = order_items.order SET ? WHERE idPizza = ?',
        [body, id]
      );
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
