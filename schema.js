const graphql = require('graphql');
const { brotliDecompress } = require('zlib');
pg = require('pg');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
const DBSingleton = require('./DBSingleton');

const dbcon = new DBSingleton();
let advOrders=[];
let advPlaceLists=[];
let companyUsers=[];
f();

async function f() {
    advOrders = await dbcon.getAdvOrders();
    advPlaceLists = await dbcon.getPlaceLists();
    companyUsers = await dbcon.getCompanyUsers();
}


const AdvOrderType = new GraphQLObjectType({
    name: 'AdvOrder',
    fields: () => ({
      advorderid: { type: GraphQLID },
      details: { type: new GraphQLNonNull(GraphQLString) },
      advplaceid: {
        type: AdvPlaceListType,
        async resolve(parent, args) {
            console.log(parent.advplaceid)
            const data = await dbcon.getPlaceList(parent.advplaceid);
            return data[0];
        }},
      userid: {
        type: CompanyUserType,
        async resolve(parent, args) {
            const data = await dbcon.getCompanyUser(parent.userid);
            return data[0];
        }

      }
    }),
  });

const AdvPlaceListType = new GraphQLObjectType({
    name: 'AdvPlaceList',
    fields: () => ({
      advplaceid: { type: GraphQLID },
      place: { type:  new GraphQLNonNull(GraphQLInt) },
      price: { type:  new GraphQLNonNull(GraphQLInt) },
      status: { type: new GraphQLNonNull(GraphQLString) },
      magazinenumber: { type: new GraphQLNonNull(GraphQLInt) }
    }),
});

const CompanyUserType = new GraphQLObjectType({
    name: 'CompanyUser',
    fields: () => ({
      userid: { type: GraphQLID },
      firstname: { type:  new GraphQLNonNull(GraphQLString) },
      middlename: { type:  new GraphQLNonNull(GraphQLString) },
      lastname: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) }
    }),
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        advPlaceLists: {
            type: new GraphQLList(AdvPlaceListType),
            resolve(parent, args) {
                return advPlaceLists;
            }
        },
        advOrders: {
            type: new GraphQLList(AdvOrderType),
            resolve(parent, args) {
                return advOrders;
            }
        },
        companyUsers: {
            type: new GraphQLList(CompanyUserType),
            resolve(parent, args) {
                return companyUsers;
            }
        }

    }
});


const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: ()=> ({
        addCompanyUser: {
            type: CompanyUserType,
            args: {
                firstname: {type: new GraphQLNonNull(GraphQLString)},
                middlename: {type: new GraphQLNonNull(GraphQLString)},
                lastname: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                const userObj = {
                    firstname: args.firstname,
                    lastname: args.lastname,
                    middlename: args.middlename,
                    email: args.email
                }
                dbcon.addCompanyUser(userObj);
                return userObj;
            }
        },

        addAdvPlaceList: {
            type: AdvPlaceListType,
            args: {
                place: {type: new GraphQLNonNull(GraphQLInt)},
                price: {type: new GraphQLNonNull(GraphQLInt)},
                status: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                const advplObj = {
                    place: args.place,
                    price: args.price,
                    status: args.status
                }
                dbcon.addAdvPlaceList(advplObj);
                return advplObj;
            }
        },
        addAdvOrder: {
            type: AdvOrderType,
            args: {
                details: {type: new GraphQLNonNull(GraphQLString)},
                advplaceid: {type: new GraphQLNonNull(GraphQLID)},
                userid: {type: new GraphQLNonNull(GraphQLID)},
                status: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                const advordObj = {
                    details: args.details,
                    advplaceid: args.advplaceid,
                    userid: args.userid,
                    status: args.status
                }
                dbcon.addAdvOrder(advordObj);
                return advordObj;
            }
        },
        updateCompanyUser: {
            type: CompanyUserType,
            args: {
                userid: {type: new GraphQLNonNull(GraphQLID)},
                firstname: {type: new GraphQLNonNull(GraphQLString)},
                middlename: {type: new GraphQLNonNull(GraphQLString)},
                lastname: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                const userObj = {
                    userid: args.userid,
                    firstname: args.firstname,
                    lastname: args.lastname,
                    middlename: args.middlename,
                    email: args.email
                }
                dbcon.updateCompanyUser(userObj);
                return userObj;
            }
        },
        updateAdvPlaceList: {
            type: AdvPlaceListType,
            args: {
                advplaceid: {type: new GraphQLNonNull(GraphQLID)},
                place: {type: new GraphQLNonNull(GraphQLInt)},
                price: {type: new GraphQLNonNull(GraphQLInt)},
                status: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                const advplObj = {
                    advplaceid: args.advplaceid,
                    place: args.place,
                    price: args.price,
                    status: args.status
                }
                dbcon.updateAdvPlaceList(advplObj);
                return advplObj;
            }
        },
        updateAdvOrder: {
            type: AdvOrderType,
            args: {
                advorderid: {type: new GraphQLNonNull(GraphQLID)},
                details: {type: new GraphQLNonNull(GraphQLString)},
                advplaceid: {type: new GraphQLNonNull(GraphQLID)},
                userid: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                const advordObj = {
                    advorderid: args.advorderid,
                    details: args.details,
                    advplaceid: args.advplaceid,
                    userid: args.userid
                }
                dbcon.updateAdvOrder(advordObj);
                return advordObj;
            }
        },
        deleteCompanyUser: {
			type: CompanyUserType,
			args: { userid: { type: GraphQLID } },
			resolve(parent, args) {
                dbcon.deleteCompanyUser(args.userid);
				return args.userid;
			}
		},
        deleteAdvPlaceList: {
			type: AdvPlaceListType,
			args: { advplaceid: { type: GraphQLID } },
			resolve(parent, args) {
                dbcon.deleteAdvPlaceList(args.advplaceid);
				return args.advplaceid;
			}
		},
        deleteAdvOrder: {
			type: AdvOrderType,
			args: { advorderid: { type: GraphQLID },
                    advplaceid: { type: GraphQLID}    
                  },
			resolve(parent, args) {
                dbcon.deleteAdvOrder(args.advorderid, args.advplaceid);
				return args.advorderid;
			}
		},

    })
});

  module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
  });
