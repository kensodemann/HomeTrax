function openShiftConnectString(env) {
  return env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    env.OPENSHIFT_APP_NAME;
}

module.exports.connectString = function(env) {
  if (env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    return openShiftConnectString(process.env);
  } else {
    return '127.0.0.1:27017/HomeApp';
  }
}