/**
 * base.js For Models
 */

//配置文件
var config = require('../config');
//工具
var Utils = require('./utils.js');
//数据库连接
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

//数据库初始化
var jixiang = function(){
  // var db = db || config.db;
  this.db = new Db(config.db,new Server(config.host,Connection.DEFAULT_PORT,{
    auto_reconnect:true
  },{}));
  this.db.open(function(err,db){
    if(err)console.log(err)
    // db.auth('mm','mmm');
  });
}
//获取聚集操作
jixiang.prototype.getCollection = function(collection,callback){
  this.db.collection(collection,function(err,db){
    if(err){
      callback(err);
    }else{
      callback(null,db);
    }
  })
}
//mongodb数据库的_id自增
jixiang.prototype.getId = function(collection,callback){
  this.getCollection('ids',function(err,db){
    if(err)callback(err);
    else{
        db.findAndModify({
          colname:collection
        },
        [],{
          $inc:{id:1}
        },{
          new:true
        },function(err,doc){
           if(!doc){//找不到该行时插入新的行
             db.insert({colname:collection,id:1},function(err){
               if(err) callback(err);
               else callback(null,1);
             });
           }else{
             if(err) callback(err);
             else callback(null,doc.id);
           }
        })  
    }
  })
}

module.exports = new jixiang();

/*--------------------------
       数据的各项操作
  --------------------------*/

//数据的保存
jixiang.prototype.save = function(data,collection,callback){
  var self = this;
  this.getId(collection,function(err,id){
    if(err)callback(err);
    else{
      data._id = id;
      self.getCollection(collection,function(err,db){
        if(err)callback(err);
        else{
          db.insert(data,{safe:true},function(err,doc){
            callback(err,doc);
          })
        }
      })
    }
  })
}
//根据条件获取数据
jixiang.prototype.get = function(condition,collection,callback){
  this.getCollection(collection,function(err,db){
    if(err)callback(err);
    else{
      var query = condition.query || {}
         ,get = condition.get || {}
         ,sort = condition.sort || {_id:1}
         ,skip = condition.skip || 0
         ,limit = condition.limit || 0
         ;
      db.find(query,get).sort(sort).skip(skip).limit(limit).toArray(function(err,doc){
        if(err) callback(err);
        else callback(null,doc);
      });
    }
  });
}
//获取一条数据
jixiang.prototype.getOne = function(query,collection,callback){
  this.getCollection(collection,function(err,db){
    if(err)callback(err);
    else{
      db.findOne(query,function(err,doc){
        if(doc)callback(err,doc);
        else callback(err,null);
      });
    }
  });
}
//根据_id进行数据的删除
jixiang.prototype.delById = function(id,collection,callback){
  this.getCollection(collection,function(err,db){
    if(err)callback(err);
    else{
      db.remove({_id:id},function(err){
        callback(err);
      })
    }
  });
}
//自增+1的数据操作，比如有用没用的点击，赞的点击
jixiang.prototype.selfplus = function(id,condition,collection,callback){
  this.getCollection(collection,function(err,db){
    if(err)callback(err);
    else{
      db.findAndModify({_id:id},[],{
        '$inc':condition.update
      },{
        new : true
      },function(err){
        callback(err);
      });
    }
  });
}
//获取数量
jixiang.prototype.count = function(query,collection,callback){
  this.getCollection(collection,function(err,db){
    if(err)callback(err);
    else{
      db.count(query,function(err,count){
        if(err)callback(err);
        else callback(null,count);
      })
    }
  });
}
//更新 query,modify
jixiang.prototype.update = function(condition,collection,callback){
  this.getCollection(collection,function(err,db){
    if(err)callback(err);
    else{
      db.update(condition.query,condition.modify,{safe:true},function(err){
        callback(err);
      });
    }
  });
}

