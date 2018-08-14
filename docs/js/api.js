!function(G) {
  const web_sql = openDatabase('todoDB', '1', 'todo database', 5 * 1024 * 1024);
  web_sql.transaction(tx => tx.executeSql('CREATE TABLE IF NOT EXISTS todos(id INTEGER, title TEXT, completed INTEGER)', []));

  const apis = {
    '/todo/insert': data => new Promise(function (rs) {
      web_sql.transaction(tx => {
        let id = Date.now();
        return tx.executeSql('INSERT INTO todos (id, title, completed) VALUES (?,?,?)',
          [id, data.text, data.isCompleted ? 1 : 0],
          () => rs({ id: id, text: data.text, isCompleted: data.isCompleted }));
      })
    })
  };

  G.fetch = (address, data) => apis[address](data);
}(window)

