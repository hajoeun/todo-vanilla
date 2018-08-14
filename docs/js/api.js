!function(G) {
  const web_sql = openDatabase('todoDB', '1', 'todo database', 5 * 1024 * 1024);
  web_sql.transaction(tx => tx.executeSql('CREATE TABLE IF NOT EXISTS todos(id INTEGER, title TEXT, completed INTEGER)', []));

  const make_query = obj =>
    Object.keys(obj).reduce((q, k) => `${q}${k}=${obj[k]} `, '');
    
  const apis = {
    '/todo/all': data => new Promise(function(rs) {
      web_sql.transaction(tx => {
        return tx.executeSql(`SELECT * FROM todos`, [], (t, { rows }) => { rs(rows) })
      })
    }),
    '/todo/insert': data => new Promise(function (rs) {
      web_sql.transaction(tx => {
        let id = Date.now();
        return tx.executeSql('INSERT INTO todos (id, title, completed) VALUES (?,?,?)',
          [id, data.title, data.completed ? 1 : 0],
          () => rs({ id: id, title: data.title, completed: data.completed }));
      })
    }),
    '/todo/delete': data => new Promise(function(rs) {
        web_sql.transaction(tx =>
          tx.executeSql('DELETE FROM todos WHERE id=?', [data.id], () => { rs({ id: data.id }) }))
    }),
    '/todo/update': ({ set, where }) => new Promise(function(rs) {
      web_sql.transaction(tx =>
        tx.executeSql(`UPDATE todos SET ${make_query(set)} WHERE ${make_query(where)}`, [], () => { rs(set) }))
    })
  };

  G.fetch = (address, data) => apis[address](data);
}(window)

