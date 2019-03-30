const Adquisicion = require('../app/Jobs/Adquisicion');
const EnvioEmail = require('../app/Utils/EnvioEmail');
const User = use('App/Models/User');

initialCreate();
cyclicEvent();

async function cyclicEvent() {
  try {
    setTimeout(async () => {
      // await Adquisicion.datos();
      cyclicEvent();
    }, 60000);

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

async function initialCreate() {
  let user = await User.query()
    .where('username', 'admin')
    .first();

  if (!user) {
    user = await User.create({
      username: 'admin',
      email: 'admin@unilever.com',
      password: 'admin'
    });
    console.log('Usuario creado con exito!');
  }
  console.log('email:', user.email, 'username:', user.username);
}

const Historico = use('App/Models/Historico');
const moment = require('moment');
const Database = use('Database');
// creteDataDefault();
async function creteDataDefault() {
  try {
    setInterval(async () => {
      const pv = Math.random() * (53 - 47) + 47;
      const sp = Math.random() * (53 - 47) + 47;
      const codigo_producto = Math.random() * (6000000 - 5999900) + 5999990;
      const fecha = moment()
        .add(-3, 'hours')
        .format('YYYY-MM-DD HH:mm:ss');

      await Database.from('historicos').insert({
        fecha,
        pv,
        sp,
        codigo_producto,
        disparo_alarma: false,
        tendencia_id: 1
      });
    }, 1000);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}
