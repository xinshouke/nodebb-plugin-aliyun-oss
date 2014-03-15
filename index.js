
'use strict';

//my first nodebb plugin

var request = require('request'),
	winston = require('winston'),
	fs = require('fs'),
    path = require('path'),
    crypto = require('crypto'),
    db = module.parent.require('./database');


(function(aliyunOss) {
    var accessKeyId = '',
        secretAccessKey = '',
        bucket = '',
        domain = '';

    db.getObjectFields("config",['aliyun-oss-accesskeyid','aliyun-oss-secretaccesskey','aliyun-oss-bucket','aliyun-oss-domain'],function(err,options) {
        if(err) {
            return winston.error(err.message);
        }
        accessKeyId = options['aliyun-oss-accesskeyid'];
        secretAccessKey = options['aliyun-oss-secretaccesskey'];
        bucket = options['aliyun-oss-bucket'];
        domain = options['aliyun-oss-domain']
    });

    aliyunOss.init = function(app, middleware, controllers) {

	};

    aliyunOss.upload = function (image, callback) {
		if(!accessKeyId) {
			return callback(new Error('invalid-aliyun-oss-access-key-id'));
		}
        if(!secretAccessKey) {
            return callback(new Error('invalid-aliyun-oss-secret-access-key'));
        }
        if(!bucket) {
            return callback(new Error('invalid-aliyun-oss-bucket-name'))
        }
        if(!domain) {
            return callback(new Error('invalid-aliyun-oss-domain'))
        }

		if(!image || !image.path) {
			return callback(new Error('invalid image'));
		}

        uploadToOss(accessKeyId,secretAccessKey,bucket,domain, image, function(err, data) {
            if(err) {
                return callback(err);
            }

            callback(null, {
                url: data,
                name: image.name
            });
        });

	};

	function uploadToOss(accessKeyId,secretAccessKey,bucket,domain, image, callback) {
        var ALY = require('./node_modules/aliyun-sdk/lib/aws');
        ALY.config = {accessKeyId:accessKeyId,secretAccessKey:secretAccessKey};
        //http://oss-cn-hangzhou.aliyuncs.com
        var oss = new ALY.OSS({
            endpoint: domain,
            apiVersion: '2013-10-15'
        });
        fs.readFile(image.path,function(err,data) {
            if(err) {
                return callback(err)
            }

            var hash = crypto.createHash('md5');
            var hex = hash.update(data+"").digest('hex');
            var dir = hex.slice(0,3),
                sub = hex.slice(3,6),
                name = hex.slice(6),
                ext = image.name.split('.')[image.name.split(".").length-1];

            var domain_none_http = domain.replace("http://","");
            var object_name = dir + '/' + sub + '/' + name + '.' + ext;
            var url = 'http://' + bucket + '.' + domain_none_http + '/' + object_name;

            oss.putObject({

                Bucket : bucket,
                Key : object_name,
                Body : data,
                ContentType : 'image/'+ext

            },function(err,data){
                if(err) {
                    return callback(err)
                }
                callback(null,url)
            })
        });
	}

	var admin = {};

	admin.menu = function(custom_header) {
		custom_header.plugins.push({
			route: '/plugins/aliyun-oss',
			icon: 'fa-picture-o',
			name: 'Aliyun OSS'
		});

		return custom_header;
	};

    admin.route = function(custom_routes, callback){
        fs.readFile(path.join(__dirname, './public/templates/admin/plugins/aliyunoss.tpl'), function(err, tpl) {
            custom_routes.routes.push({
                route: '/plugins/aliyun-oss',
                method: "get",
                options: function(req, res, callback) {
                    callback({
                        req: req,
                        res: res,
                        route: '/plugins/aliyun-oss',
                        name: 'Aliyun OSS',
                        content: tpl
                    });
                }
            });

            callback(null, custom_routes);
        });
    };


    aliyunOss.admin = admin;

}(module.exports));

