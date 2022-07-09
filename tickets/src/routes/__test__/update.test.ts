import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/ticket';
import { generateRandomMongoId } from '../../util/helpers';

it('returns a 404 if the provided id does not exist', async () => {
  const id = generateRandomMongoId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signIn())
    .send({
      title: 'asdasdasd',
      price: 20
    })
    .expect(404);

});

it('returns a 401 if the user is not authenticated', async () => {
  const id = generateRandomMongoId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'asdasdasd',
      price: 20
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signIn())
    .send({
      title: 'asdsad',
      price: 20
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signIn())
    .send({
      title: 'askjdhasjd',
      price: 1000
    })
    .expect(401);
  
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signIn();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdsad',
      price: 20
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 1000
    })
    .expect(400); 

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdasdasd',
      price: -1000
    })
    .expect(400); 
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signIn();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdsad',
      price: 20
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(100);
    
});