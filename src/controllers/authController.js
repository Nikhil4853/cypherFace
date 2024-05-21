const axios = require('axios');
const bcrypt = require('bcrypt');
const validator = require('validator');
const UserModel = require('../models/user.model');
// const secretKey = process.env.JWT_SECRET || 'default_secret_key';


class User {
    static async register(req, res) {
                     /*
* #swagger.tags = ['authRoute']
*/
        try {
            const { firstname, email, Password, lastname, phone, profileImgURL } = req.body;

            // Check if email is valid
            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: 'Invalid Email Address' });
            }

            const existingUser = await UserModel.findOne({ email: email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            if (!firstname) {
                return res.status(400).json({ message: 'Firstname is missing' });
            }

            if (!Password) {
                return res.status(400).json({ message: 'Password is missing' });
            }

            if (!lastname) {
                return res.status(400).json({ message: 'Lastname is missing' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(Password, 10);

            const requestData = {
                "entity": {
                    "email": email,
                    "first_name": firstname,
                    "last_name": lastname,
                    "personal_address": {
                        "city": "San Mateo",
                        "country": "USA",
                        "line1": "741 Douglass St",
                        "line2": "Apartment 7",
                        "postal_code": "94114",
                        "region": "CA"
                    },
                    "phone": phone
                },
                "tags": {
                    "key": "value"
                }
            };

            const username = "USsRhsHYZGBPnQw8CByJyEQW";
            const password = "8a14c2f9-d94b-4c72-8f5c-a62908e5b30e";

            let response;
            try {
                response = await axios.post('https://finix.sandbox-payments-api.com/identities', requestData, {
                    auth: {
                        username,
                        password
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                
            } catch (error) {
                console.error('Error:', error.response ? error.response.data : error.message);
                if (error.response && error.response.data && error.response.data._embedded && error.response.data._embedded.errors) {
                    const errors = error.response.data._embedded.errors;
                    errors.forEach((err, index) => {
                        console.error(`Error ${index + 1}:`, err);
                    });
                }

                return res.status(500).json({ error: 'Internal server error' });
            }
 
            const newUser = await UserModel.create({
                firstname: firstname,
                email: email,
                password: hashedPassword,
                lastname: lastname,
                phone: phone,
                profileImgURL: profileImgURL,
                indentity: response.data.id
            });



            return res.status(201).json({ message: 'User Registered Successfully', user: newUser });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async updateUser(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).send('User ID is required.');
            }


            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).send('User not found.');
            }
            if (Object.keys(req.body).length === 0) {
                return res.status(400).send('Request body is empty.');
            }

            const userModelKeys = Object.keys(UserModel.schema.paths);


            const invalidParams = Object.keys(req.body).filter(key => !userModelKeys.includes(key));
            if (invalidParams.length > 0) {
                return res.status(400).send('Wrong parameters');
            }
            // if (req.body.phone && req.body.phone.length !== 10) {
            //     return res.status(400).send('Invalid contact number');
            // }

            if (req.body.firstname) user.firstname = req.body.firstname;
            if (req.body.email) user.email = req.body.email;
            if (req.body.lastname) user.fullname = req.body.lastname;
            // if (req.body.phone) user.phone = req.body.phone;


            await user.save();

            res.status(200).send('User updated successfully!');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating user.');
        }
    };
}

module.exports = User;
