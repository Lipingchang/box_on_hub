var express = require('express');
var app = express();

app.use('/',function(req,res,next){
	res.send('ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC8irPkDS7lDqoPEmj+P66K3+89/3SyHH6xP1F5EIwmMbE3OnBAvGWlkBUEcmj9YvW7kGFNq1n87MdkRWTzwmxbN+LSlpDNJq4AkJHlE6RDIiYCEVTJ0jkoBp4RQODNVLbYwdzAMSOa3Eq4oiCe4tHFMvqsB2KBoecU4AwL8EMbEOAzmSgAt4xeEHCJ4kqpKnxnkw8w5iD9ZVTx5zSiOkjrwD47OyWMwgBzj8c3O9TWXJxtgumsB1SeYiFRS1qxda4SO5bDsA32mB5lZNURkQYSJ+MTO55EmfCpd/tnKjH0vdxjZwMSDFSNrH/I8+KmA8aJ6mPRPqi55LYjeqAl/k39 DogEgg@DESKTOP-UHRNGP9')
	
});
app.listen(12138, function() {
 console.log('App listening at port 12138;');
});
