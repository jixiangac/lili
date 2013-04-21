db.dropDatabase();
db.users.insert({
    username : 'admin'
   ,pwd : hex_md5("123456")
   ,email : 'admin@gmail.com'
   ,cat : 3
   ,regdate : Date.now()
   ,logindate : Date.now()
});