function middleware(){
    var fs = require("fs"),
        path = require("path"),
        url = require("url"),
        mime = require("mime"),
        querystring = require('querystring'),
        promotionsIntegration = require('./promotions-integration')(querystring, fs, path),
        distFolder = path.resolve(__dirname, "../../dist/"),
        bowerFolder = path.resolve(__dirname, "../../"),
        routes = {
            '/': '/dist/index.html',
            '/api/contentblocks': '/gulp-tasks/middleware/storage/get-content-blocks.json',
            '/api/layouts':'/gulp-tasks/middleware/storage/get-layouts.json',
            '/api/layouts/1':'/gulp-tasks/middleware/storage/get-layout-basic.html',
            '/api/layouts/2':'/gulp-tasks/middleware/storage/get-layout-hero.html',
            '/api/messages/1':'/gulp-tasks/middleware/storage/get-message.json'
        },
        routeHandlers = {
            '/api/promotions': promotionsIntegration.getPromotions
        };

    function middleware(req, res, next){

        var folder = distFolder,
        fileName = url.parse(req.url),
        custom = false;

        fileName = fileName.href.split(fileName.search).join("");

        if(fileName.indexOf('/bower_components') === 0 || routes[fileName]){
            folder = bowerFolder;
            custom = true;
        }

        if(routes[fileName]){
            fileName =  routes[fileName];
            custom = true;
        }

        var fileExists = fs.existsSync(folder + fileName);
        if(custom && fileExists){
            return fs.readFile(folder + fileName, function(error, content) {
                res.setHeader("Content-Type", mime.lookup(fileName));
                res.end(content, 'utf-8');
            });
        }

        if(routeHandlers[fileName]){
            return routeHandlers[fileName](req, res);
        }

        return next();
    }

    return {
        middleware: middleware,
        routes: routes,
        routeHandlers: routeHandlers
    };
}

module.exports = middleware;
