const _ = require("lodash");
const debug = require("debug")("server:booking.controller");
const Booking = require("./booking.model");
const Course = require("../course/course.model");
const fields = Object.keys(_.omit(Booking.schema.paths, ["__v", "_id"]));
const nodemailer = require('nodemailer');
const { transporter } = require("../../config/nodemailer/transporter");
var ejs = require("ejs");
var path = require("path");
var moment = require('moment');

const create = (req, res, next) =>
{
    const properties = _.pick(req.body, fields);
    const newBooking = new Booking(properties);
    
    Course.findOne({_id: newBooking.course }).populate('academy').exec(function(courseErr, course)
    {
        if (courseErr)
        {
            console.log("courseErr: ", courseErr);
            res.status(400).json({ message: "Something went wrong when trying to create the booking", error: courseErr });
        }
        else
        {    
            newBooking.save(err =>
            {
                if (err)
                {
                    debug(err);
                    res.status(400).json({ message: "Something went wrong when trying to create the booking", error: err });
                }
                else
                {
                    ejs.renderFile(path.resolve(__dirname + "/../../config/nodemailer/templates/booking_user.ejs"),
                    {
                        name: newBooking.name,
                        group: newBooking.group,
                        courseTitle: course.title,
                        coursePrice: course.price,
                        courseStartDate: moment(course.startDate).locale("es").format("dddd D MMMM"),
                        academyName: course.academy.name.toUpperCase(),
                        academyAddress: course.academy.address
                    },
                    function (error, data)
                    {
                        if (error)
                        {
                            console.log('Message error: %s', error);
                            
                            res.status(400).json({ message: "Something went wrong when trying to create the booking", error: error })
                        }
                        else
                        {
                            // Send user email
                            var userEmailOptions =
                            {
                                from: '"Appcademos" <hello@appcademos.com>', // sender address
                                to: [newBooking.email],
                                subject: 'Reserva confirmada ✔', // Subject line
                                html: data,
                                attachments: [
                                {
                                    filename: 'appcademos_facebook.png',
                                    path: path.resolve(__dirname + '/../../config/nodemailer/images/facebook.png'),
                                    cid: 'facebook@appcademos'
                                },
                                {
                                    filename: 'appcademos_twitter.png',
                                    path: path.resolve(__dirname + '/../../config/nodemailer/images/twitter.png'),
                                    cid: 'twitter@appcademos'
                                },
                                {
                                    filename: 'appcademos_instagram.png',
                                    path: path.resolve(__dirname + '/../../config/nodemailer/images/instagram.png'),
                                    cid: 'instagram@appcademos'
                                },
                                {
                                    filename: 'appcademos_web.png',
                                    path: path.resolve(__dirname + '/../../config/nodemailer/images/link.png'),
                                    cid: 'link@appcademos'
                                }]
                            }
                            transporter.sendMail(userEmailOptions, function (e, info)
                            {
                                if (e)
                                {
                                    console.log('Message error: %s', e);
                                    
                                    res.status(400).json({ message: "Something went wrong when trying to create the booking", error: e })
                                }
                                else
                                {
                                    console.log('Message sent: %s', JSON.stringify(info));
                                    
                                    res.status(200).json(newBooking);
                                }
                            });
                            
                            ejs.renderFile(path.resolve(__dirname + "/../../config/nodemailer/templates/booking_team.ejs"),
                            {
                                name: newBooking.name,
                                phone: newBooking.phone,
                                email: newBooking.email,
                                group: newBooking.group,
                                courseId: course._id,
                                courseTitle: course.title,
                                coursePrice: course.price,
                                academy: course.academy.name,
                                academyAddress: course.academy.address
                            },
                            function (errorTeam, dataTeam)
                            {
                                if (errorTeam)
                                {
                                    console.log('Team Message error: %s', errorTeam);
                                }
                                else
                                {
                                    // Send team email
                                    var teamEmailOptions =
                                    {
                                        from: '"Appcademos" <hello@appcademos.com>',
                                        to: ['hello@appcademos.com'],
                                        subject: '¡CLINC, CLINC, CLINC! 😎',
                                        html: dataTeam
                                    }
                                    transporter.sendMail(teamEmailOptions, function (ee, infoo)
                                    {
                                        if (ee)
                                        {
                                            console.log('Team email Message error: %s', ee);
                                        }
                                        else
                                        {
                                            console.log('Team email Message sent: %s', JSON.stringify(infoo));
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

module.exports = { create };
