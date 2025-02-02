db.createUser({
    user: "admin",
    pwd: "admin",
    roles: [
        {
            role: "readWrite",
            db: "auction_house"
        }
    ]
});
db = db.getSiblingDB('auction_house');
db.createCollection('users');
db.getCollection('users').insertMany(
    [
        {
            "name": "Mario",
            "surname": "Marietti",
            "username": "mariom",
            "password": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        },
        {
            "name": "Paolo",
            "surname": "Paolini",
            "username": "paolop",
            "password": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        },
        {
            "name": "Fabio",
            "surname": "Fabietti",
            "username": "fabiof",
            "password": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        },
        {
            "name": "Carlo",
            "surname": "Carlino",
            "username": "carloc",
            "password": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        },
        {
            "name": "Gian Fabrizio",
            "surname": "Fabrizio",
            "username": "gff",
            "password": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        },
        {
            "name": "Romario",
            "surname": "de Souza Faria",
            "username": "rom",
            "password": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        },
        {
            "name": "Giuseppe",
            "surname": "Cruciani",
            "username": "crux",
            "password": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        },
        {
            "name": "Mario",
            "surname": "Draghi",
            "username": "md",
            "password": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        },
        {
            "name": "Pietro",
            "surname": "Grifone",
            "username": "pietrog",
            "password": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        },
        {
            "name": "Paul",
            "surname": "Geaorge",
            "username": "pg8",
            "password": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
        }
    ]
);

db = db.getSiblingDB('auction_house');
db.createCollection('auctions');


const insertAuction = [
        {
            "owner": "mariom",
            "title": "Figurina Panini rara",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "expiryDate": ISODate("2025-02-08T15:00:00.000Z"),
            "initialValue": "400",
            "currentHigherBid": 920
        },
        {
            "owner": "paolop",
            "title": "Orologio d'epoca",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "expiryDate": ISODate("2025-01-31T21:00:00.000Z"),
            "initialValue": "320",
            "currentHigherBid": 1050
        },
        {
            "owner": "fabiof",
            "title": "Dipinto rinascimentale",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "expiryDate": ISODate("2025-01-08T17:00:00.000Z"),
            "initialValue": "510",
            "currentHigherBid": 1400
        },
        {
            "owner": "carloc",
            "title": "Auto d'epoca",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "expiryDate": ISODate("2025-02-12T16:00:00.000Z"),
            "initialValue": "600",
            "currentHigherBid": 1350
        },
        {
            "owner": "gff",
            "title": "Scultura in bronzo",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "expiryDate": ISODate("2025-02-06T18:00:00.000Z"),
            "initialValue": "450",
            "currentHigherBid": 980
        },
        {
            "owner": "rom",
            "title": "Libro antico",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "expiryDate": ISODate("2025-02-02T07:00:00.000Z"),
            "initialValue": "220",
            "currentHigherBid": 750
        },
        {
            "owner": "crux",
            "title": "Moneta romana",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "expiryDate": ISODate("2025-02-09T14:00:00.000Z"),
            "initialValue": "330",
            "currentHigherBid": 890
        },
        {
            "owner": "md",
            "title": "Giacca autografata",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "expiryDate": ISODate("2025-01-14T16:00:00.000Z"),
            "initialValue": "280",
            "currentHigherBid": 670
        },
        {
            "owner": "pietrog",
            "title": "Chitarra vintage",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "expiryDate": ISODate("2025-01-22T13:00:00.000Z"),
            "initialValue": "530",
            "currentHigherBid": 1220
        },
        {
            "owner": "pg8",
            "title": "Macchina da scrivere d'epoca",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "expiryDate": ISODate("2025-02-01T09:00:00.000Z"),
            "initialValue": "410",
            "currentHigherBid": 990
        }
    ];
const actionResult = db.getCollection('auctions').insertMany(insertAuction);
const auctionIds = Object.values(actionResult.insertedIds);

db = db.getSiblingDB('auction_house');
db.createCollection('bids');

db.getCollection('bids').insertMany(
    [
        {
          "auctionId":  auctionIds[0],
          "bidderUser": "crux",
          "bidDate": ISODate("2025-02-05T18:30:00.000Z"),
          "bidValue": 600
        },
        {
          "auctionId": auctionIds[0],
          "bidderUser": "md",
          "bidDate": ISODate("2025-02-05T19:00:00.000Z"),
          "bidValue": 870
        },
        {
          "auctionId": auctionIds[0],
          "bidderUser": "rom",
          "bidDate": ISODate("2025-02-05T19:30:00.000Z"),
          "bidValue": 920
        },
      
        {
          "auctionId": auctionIds[1],
          "bidderUser": "fabiof",
          "bidDate": ISODate("2025-01-30T18:30:00.000Z"),
          "bidValue": 600
        },
        {
          "auctionId": auctionIds[1],
          "bidderUser": "paolop",
          "bidDate": ISODate("2025-01-31T07:00:00.000Z"),
          "bidValue": 900
        },
        {
          "auctionId": auctionIds[1],
          "bidderUser": "gff",
          "bidDate": ISODate("2025-01-31T19:30:00.000Z"),
          "bidValue": 1050
        },
      
        {
          "auctionId": auctionIds[2],
          "bidderUser": "gff",
          "bidDate": ISODate("2025-01-08T15:30:00.000Z"),
          "bidValue": 750
        },
        {
          "auctionId": auctionIds[2],
          "bidderUser": "carloc",
          "bidDate": ISODate("2025-01-08T16:00:00.000Z"),
          "bidValue": 900
        },
        {
          "auctionId": auctionIds[2],
          "bidderUser": "pg8",
          "bidDate": ISODate("2025-01-08T16:30:00.000Z"),
          "bidValue": 1400
        },
      
        {
          "auctionId": auctionIds[3],
          "bidderUser": "rom",
          "bidDate": ISODate("2025-02-11T18:30:00.000Z"),
          "bidValue": 1000
        },
        {
          "auctionId": auctionIds[3],
          "bidderUser": "md",
          "bidDate": ISODate("2025-02-11T19:00:00.000Z"),
          "bidValue": 1250
        },
        {
          "auctionId": auctionIds[3],
          "bidderUser": "pietrog",
          "bidDate": ISODate("2025-02-11T19:30:00.000Z"),
          "bidValue": 1350
        },
      
        {
          "auctionId": auctionIds[4],
          "bidderUser": "pg8",
          "bidDate": ISODate("2025-02-05T18:30:00.000Z"),
          "bidValue": 550
        },
        {
          "auctionId": auctionIds[4],
          "bidderUser": "crux",
          "bidDate": ISODate("2025-02-05T19:00:00.000Z"),
          "bidValue": 700
        },
        {
          "auctionId": auctionIds[4],
          "bidderUser": "gff",
          "bidDate": ISODate("2025-02-05T19:30:00.000Z"),
          "bidValue": 980
        },
      
        {
          "auctionId": auctionIds[5],
          "bidderUser": "gff",
          "bidDate": ISODate("2025-02-01T18:30:00.000Z"),
          "bidValue": 400
        },
        {
          "auctionId": auctionIds[5],
          "bidderUser": "rom",
          "bidDate": ISODate("2025-02-01T19:00:00.000Z"),
          "bidValue": 560
        },
        {
          "auctionId": auctionIds[5],
          "bidderUser": "crux",
          "bidDate": ISODate("2025-02-01T19:30:00.000Z"),
          "bidValue": 750
        },
      
        {
          "auctionId": auctionIds[6],
          "bidderUser": "pietrog",
          "bidDate": ISODate("2025-02-08T18:30:00.000Z"),
          "bidValue": 530
        },
        {
          "auctionId": auctionIds[6],
          "bidderUser": "pg8",
          "bidDate": ISODate("2025-02-08T19:00:00.000Z"),
          "bidValue": 800
        },
        {
          "auctionId": auctionIds[6],
          "bidderUser": "md",
          "bidDate": ISODate("2025-02-08T19:30:00.000Z"),
          "bidValue": 890
        },
      
        {
          "auctionId": auctionIds[7],
          "bidderUser": "pg8",
          "bidDate": ISODate("2025-01-14T18:30:00.000Z"),
          "bidValue": 300
        },
        {
          "auctionId": auctionIds[7],
          "bidderUser": "crux",
          "bidDate": ISODate("2025-01-14T19:00:00.000Z"),
          "bidValue": 430
        },
        {
          "auctionId": auctionIds[7],
          "bidderUser": "gff",
          "bidDate": ISODate("2025-01-14T19:30:00.000Z"),
          "bidValue": 670
        },
        {
            "auctionId": auctionIds[8],
            "bidderUser": "mariom",
            "bidDate": ISODate("2025-01-21T18:30:00.000Z"),
            "bidValue": 550
          },
          {
            "auctionId": auctionIds[8],
            "bidderUser": "paolop",
            "bidDate": ISODate("2025-01-21T19:00:00.000Z"),
            "bidValue": 880
          },
          {
            "auctionId": auctionIds[8],
            "bidderUser": "rom",
            "bidDate": ISODate("2025-01-21T19:30:00.000Z"),
            "bidValue": 1220
          },
        
          {
            "auctionId": auctionIds[9],
            "bidderUser": "fabiof",
            "bidDate": ISODate("2025-01-31T18:30:00.000Z"),
            "bidValue": 500
          },
          {
            "auctionId": auctionIds[9],
            "bidderUser": "gff",
            "bidDate": ISODate("2025-01-31T19:00:00.000Z"),
            "bidValue": 640
          },
          {
            "auctionId": auctionIds[9],
            "bidderUser": "md",
            "bidDate": ISODate("2025-01-31T19:30:00.000Z"),
            "bidValue": 990
          },
      ]
);