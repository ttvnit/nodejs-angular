 
var mysql = require('mysql');
module.exports = {
		client: mysql.createClient(root.settings.DATABASE),
		filter: function(val){
			switch(typeof val){
			case 'string':
				return val.replace("'","\'"); 
				break;
			case 'object':
				return JSON.stringify(val); 
			default:
				return "'"+ val + "'"; 
			}
		},
		setVal: function(values){
			var field_val = Array();
			switch(typeof values[index]){
			case 'string':
				field_val[i++] = values[index].replace("'","\'"); 
				break;
			case 'object':
				field_val[i++] = angular.toJson(values[index]); 
			default:
				field_val[i++] = "'"+ values[index]+ "'"; 
			}
			return field_val;
		},
		insert: function(table, values , fn) {
			var sql = 'insert into ' + table;
			var field_name = Array();
			var field_val = Array();
			var field_params = Array();
			var i=0;
			for (var index in values) {
				field_name[i] = index; 
				field_params [i] = '?';
				field_val[i++] = this.filter(values[index]);
			}
			sql = sql + ' (' + field_name.join(',') + ') values ('+ field_params.join(',')  +')';
			this.client.query(sql , field_val, function(err,result){
		        if(err){
		            console.log("ClientReady Error:" + err.message);
		            return;
		        }
		        //fn(result);
		        console.log('Id inserted:'+ result.insertId);
		    });
		},
		update: function(table, values, condition) {
			var fields = Array(),i=0;
			for (var index in values) {
				fields[i] = index + '=' + this.filter(values[index]); 
			}
			var sql = 'update ' + table + ' set ' + fields.join(',') + ' where ' + condition[0];
			
			this.client.query(sql, condition[1],
					function selectCb(err, details, fields) {
						console.log(details);
					});
		},
		/*delete: function(){
			this.client.query().
	        delete().
	        from('users')
	        where('id = ?', [ 1 ])
	        execute(function(error, result) {
	                if (error) {
	                        console.log('ERROR: ' + error);
	                        return;
	                }
	                console.log('RESULT: ', result);
	        });
		},
		query: function(){
			this.client.query('SELECT * FROM ' + this.name('users') + ' WHERE ' + this.name('name') + ' LIKE \'' + this.escape('%John%') + '\'').
	        execute(function(error, rows, cols) {
	                if (error) {
	                        console.log('ERROR: ' + error);
	                        return;
	                }
	                console.log(rows.length + ' ROWS found');
	        });
		},
		getUserDetailsByEmail:function(email, res) {
			client.query("select * from userdetails where email=?", [ email ],
					function selectCb(err, details, fields) {
						res.send(err | fields);
					});
		}*/
};