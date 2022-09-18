
const log = {
    debug: function(title, detail) { 
        console.debug(`[${title}]: ${detail}`)
    },
    query: function(query) {
        this.debug("QUERY", JSON.stringify(query))
    },
    content: function(body, path) { 
        console.debug(`[PATH]: ${JSON.stringify(path)}; [BODY/QUERY]: ${JSON.stringify(body)}`) 
    },
    request: function(method, route) { 
        console.log(`[${method}]: ${route}`) 
    },
    get: function(route) { 
        this.request("GET", route) 
    },
    post: function(route) { 
        this.request("POST", route) 
    },
    delete: function(route) { 
        this.request("DELETE", route) 
    },
    put: function(route) { 
        this.request("PUT", route) 
    },
    error: function(err) { 
        console.error(`[ERROR ${err.code}]: ${err}`)
    }

}

module.exports = log