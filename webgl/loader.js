/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/

Framework.components.push(function(framework, gl){
    var extre = /\.([^\.]+)$/;

    framework.Loader = Class({
        __init__: function(){
            this.events = new EventManager();
        },
        error: function(callback){
            this.events.on('error', function(event, description){
                callback(description);
            });
            return this;
        },
        load: function(data){
            var self = this;
            var count = Object.keys(data).length
            $.each(data, function(name, path){
                //count += 1;
                var extension = path.match(extre)[1];

                switch(extension){
                    case 'jpg': case 'png':
                   		console.info("requesting img " + name)
                        $('<img>')
                            .attr('src', path)
                            .load(function(source) {
                                count -= 1;
                                console.info("done img " + name);
                                data[name] = new framework.Texture()
                                    .image(this)
                                    .repeat()
                                    .mipmap();
                                if(count == 0){
                                    console.info("framework <img> ready");
                                    self.events.dispatch('ready', data);
                                }
                            });
                       break;
                    case 'shader': 
                   		console.info("requesting shader " + name)
                        $.get(path, function(source){
/*
                            try{
                                data[name] = new framework.Shader(source, path);
                                count -= 1;
                                if(count == 0){
                                    self.events.dispatch('ready', data);
                                }
                            }
                            catch(error){
                                self.events.dispatch('error', error);
                            }
*/
                        })
                            .fail(function(response) {
                                alert(response.status);
                            })
                            .done(function(source) {
                                console.info("done " + name);
                                try{
                                    count -= 1;
                                    data[name] = new framework.Shader(source, path);
                                    if(count == 0){
                                        console.info("framework ready");
                                        self.events.dispatch('ready', data);
                                    }
                                }
                                catch(error){
                                    self.events.dispatch('error', error);
                                }
                            });
                        break;
                    default:
                     	console.info("unknown file type "+ extension);
                    	count--;
                    	break;
                }
            });
            return this;
        },
        ready: function(callback){
            this.events.on('ready', callback);
            return this;
        },
    });
});
