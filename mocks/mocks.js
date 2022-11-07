userMock = {
    "_id": "63190a6acf10c3930a8386be",
    "email": "gnachoxp@gmail.com",
    "password": "$2b$12$zYXkE639r0L.JlYVqYM1pODUXeknllVEB0YqZIhhX8HINF8yKpHXS",
    "name": "Igna Garcia",
    "telegramId": "_982840555"
}

walletsMock = [
    {
        "_id": "632262795bb58efd145caee3",
        "owner": "63190a6acf10c3930a8386be",
        "label": "Efectivo",
        "acum": 30000,
        "alias": "efv",
        "createDate": "2022-09-14T23:23:37.596",
        "__v": 0
    },
    {
        "_id": "633262795bb58efd145caee3",
        "owner": "63190a6acf10c3930a8386be",
        "label": "Mercado Pago",
        "acum": 0,
        "alias": "mp",
        "createDate": "2022-09-14T23:23:37.596",
        "__v": 0
    },
    {
        "_id": "634262795bb58efd145caee3",
        "owner": "63190a6acf10c3930a8386be",
        "label": "Uala",
        "acum": 76000,
        "alias": "uala",
        "createDate": "2022-09-14T23:23:37.596",
        "__v": 0
    }
]

commandsMock = [
    {
        "_id": "632631295e6456f33c6c3937",
        "owner": "63190a6acf10c3930a8386be",
        "category": "63190ab3cf10c3930a8386bf",
        "tags": null,
        "wallet": null,
        "expense": true,
    },
    {
        "_id": "632631295e6456f33c6c3937",
        "owner": "63190a6acf10c3930a8386be",
        "category": "63190ab3cf10c3930a8386bf",
        "tags": null,
        "wallet": null,
        "expense": false,
    }
]

categoriesMock = [
    {
        "_id": "63190ab3cf10c3930a8386bf",
        "owner":null,
        "alias":"alim",
        "label":"Alimentos",
        "isOut":true
    },
    {
        "_id": "63290ab3cf10c3930a8386bf",
        "owner":null,
        "alias":"imp",
        "label":"Impuestos",
        "isOut":true
    },
    {
        "_id": "63390ab3cf10c3930a8386bf",
        "owner":"63190a6acf10c3930a8386be",
        "alias":"subs",
        "label":"Subscripciones",
        "isOut":true
    }
]

tagsMock = [
    {
        "_id": "63225edaa4d8591844853a24",
        "owner": "63190a6acf10c3930a8386be",
        "label": "Recurrente",
        "alias": "recu",
        "createDate": "2022-09-14T23:23:37.596"
    },
    {
        "_id": "63425edaa4d8591844853a24",
        "owner": "63190a6acf10c3930a8386be",
        "label": "Extraordinario",
        "alias": "extra",
        "createDate": "2022-09-14T23:23:37.596"
    },
    {
        "_id": "63325edaa4d8591844853a24",
        "owner": "63190a6acf10c3930a8386be",
        "label": "Chucheria",
        "alias": "chuch",
        "createDate": "2022-09-14T23:23:37.596"
    }
]

limitsMock = [
    {
        "_id": "63190b3ecf10c3930a8386c1",
        "owner": "63190a6acf10c3930a8386be",
        "category": "63190ab3cf10c3930a8386bf",
        "month": "9",
        "year": "2022",
        "acum": 10000,
        "amount": 15000
    },
    {
        "_id": "63290b3ecf10c3930a8386c1",
        "owner": "63190a6acf10c3930a8386be",
        "category": "63490ab3cf10c3930a8386bf",
        "month": "8",
        "year": "2021",
        "acum": 300,
        "amount": 1000
    },
    {
        "_id": "63390b3ecf10c3930a8386c1",
        "owner": "63190a6acf10c3930a8386be",
        "category": "63890ab3cf10c3930a8386bf",
        "month": "9",
        "year": "2022",
        "acum": 40000,
        "amount": 35000
    }
]

recordsMock = [
    {
        "_id": "6319382ac68ba79bdbb53a16",
        "owner": "63190a6acf10c3930a8386be",
        "category": "63190ab3cf10c3930a8386bf",
        "tags": [],
        "amount": 100,
        "isOut": true,
        "date": "2022-09-08T00:32:42.724Z"
    },
    {
        "_id": "6319381b858b58bc587c57bb",
        "owner": "63190a6acf10c3930a8386be",
        "category": "63190ab3cf10c3930a8386bf",
        "tags": [],
        "amount": 570,
        "isOut": true,
        "date": "2022-09-08T00:32:27.023Z"
    },
    {
        "_id": "631937815b5e97db072f1bce",
        "owner": "63190a6acf10c3930a8386be",
        "category": "63190ab3cf10c3930a8386bf",
        "tags": [],
        "amount": 30000,
        "isOut": true,
        "date": "2022-09-08T00:29:53.218Z"
    }
]

module.exports = { userMock, walletsMock, commandsMock, categoriesMock, tagsMock, limitsMock, recordsMock }