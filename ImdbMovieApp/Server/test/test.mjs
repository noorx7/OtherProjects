import assert from 'assert';
import axios from 'axios';
import { describe, it } from 'mocha';


const auth_URL = 'http://localhost:4000/auth';
const movie_URL = 'http://localhost:4000/movie'
const user_URL = "http://localhost:4000/user"
const tconst = 'tt0000963'
const second_tconst = 'tt0000002'
const movieName = "A Mexican's Gratitude"
let token;
describe('Register  a user', () => {
    describe('POST /register', () => {
        it('Should add a new user to the database', (done) => {
            axios.post(`${auth_URL}/register`, {
                firstName: "Abdullah",
                lastName: "Aqeel",
                email: "aqeel@mun.ca",
                password: "Bugs8323",
                walletAmount: 50,
                isAdmin: true
            })
                .then((response) => {
                    assert.strictEqual(response.status, 201);
                    done();
                })
                .catch((error) => {
                    assert.fail(error);
                });
        });
    });
})

describe('Login a User', () => {
    describe('POST /login', () => {
        it('Should login a user to the database', (done) => {
            axios.post(`${auth_URL}/login`, {
                email: "aqeel@mun.ca",
                password: "Bugs8323",
            })
                .then((response) => {
                    token = response.data.token;
                    assert.strictEqual(response.status, 200);
                    done();
                })
                .catch((error) => {
                    assert.fail(error);
                });
        });
    });
})


describe('Fetchings users information', () => {
    describe('Get /getUser', () => {
        it('It Fetchs a users personal information, only a user fetches his own information', (done) => {
            axios.get(`${user_URL}/getUser`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    assert.strictEqual(response.status, 200);
                    done();
                })
                .catch((error) => {
                    assert.fail(error);
                });
        });
    });
})



describe('Get a users Wallet', () => {
    describe('Get /getWalletAmount/:id', () => {
        it('It Fetchs a users personal wallet information, only a user fetches his own wallet information', (done) => {
            axios.get(`${user_URL}/getWalletAmount`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    assert.strictEqual(response.status, 200);
                    done();
                })
                .catch((error) => {
                    assert.fail(error);
                });
        });
    });
})



describe('Fetch a movie from the database', () => {
    describe('Fetch /fetch/:tconst', () => {
        it('Should fetch a movie from the database', (done) => {
            axios.get(`${movie_URL}/fetch/${tconst}`)
                .then((response) => {
                    assert.strictEqual(response.status, 200);
                    done();
                })
                .catch((error) => {
                    assert.fail(error);
                });
        });
    });
})


describe('Fetch a movie by its name', () => {
    describe('Fetch /fetch', () => {
        it('Should fetch a movie from the database', (done) => {
            axios.post(`${movie_URL}/fetch`, {
                name: movieName
            })
                .then((response) => {
                    assert.strictEqual(response.status, 200);
                    done();
                })
                .catch((error) => {
                    assert.fail(error);
                });
        });
    });
})



describe('Add a movie to a Users Favourite', () => {
    describe('Post /add_favourite/:tconst', () => {
        it('Should Add a movie to the Users favourite', (done) => {
            axios.post(`${movie_URL}/add_favourite/${tconst}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    assert.strictEqual(response.status, 200);
                    done();
                })
                .catch((error) => {
                    assert.fail(error);
                });
        });
    });
})


describe('Removing a movie from Users Favourite', () => {
    describe('Post /remove_favourite/:tconst', () => {
        it('Remove  a movie from users  favourite', (done) => {
            axios.post(`${movie_URL}/remove_favourite/${tconst}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    assert.strictEqual(response.status, 200);
                    done();
                })
                .catch((error) => {
                    assert.fail(error);
                });
        });
    });
})






describe('Updating a User Credentials', () => {
    describe('PUT /update', () => {
        it('Should add a new user to the database', (done) => {
            axios.put(`${auth_URL}/update`, {
                newEmail: "aqeel1@mun.ca",
                newPassword: "Bugs18323",
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    assert.strictEqual(response.status, 200);
                    done();
                })
                .catch((error) => {
                    assert.fail(error);
                });
        });
    });
})


describe('Delete a User from the Database', () => {
    describe('Delete /delete', () => {
        it('Should delete a user from the database', (done) => {
            axios.delete(`${auth_URL}/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    assert.strictEqual(response.status, 200);
                    done();
                })
                .catch((error) => {
                    assert.fail(error);
                });
        });
    });
})










