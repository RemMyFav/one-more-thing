const Queue = require("bee-queue");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const dotnv = require("dotenv").config();
const Calendar = require("../models/Group");
const { findById } = require("../models/User");
const mailing = new Queue("mail", {
  prefix: "bq",
  stallInterval: 5000,
  nearTermWindow: 1200000,
  delayedDebounce: 1000,
  redis: {
    host: "127.0.0.1",
    port: 6379,
    db: 0,
    options: {},
  },
  isWorker: true,
  getEvents: true,
  sendEvents: true,
  storeJobs: true,
  ensureScripts: true,
  activateDelayedJobs: true,
  removeOnSuccess: false,
  removeOnFailure: false,
  redisScanCount: 100,
});

//Placing a mailing, the email will be sent when todo is starting
const placeMailing = asyncHandler(async (job) => {
  if (job.start.getTime() <= Date.now()) {
    return;
  }
  return await mailing.createJob(job).delayUntil(Date.parse(job.start)).save();
});

//Clean all mailing
const emptyMailing = asyncHandler(async (job) => {
  mailing.getJobs("delayed", { size: 100 }).then((jobs) => {
    jobs.map((jobId) => {
      mailing
        .removeJob(jobId.id)
        .then(() => console.log(`Job ${jobId.id} was removed`));
    });
  });
});

//Print out all delayed mailing
const checkMailing = asyncHandler(async (job) => {
  mailing.getJobs("delayed", { size: 100 }).then((jobs) => {
    // console.log(jobs);
    const jobIds = jobs.map((job) => job.id);
    const jobName = jobs.map((job) => job.data.title);
    console.log(`Job ids: ${jobIds.join(" ")}`);
    console.log(`Job name: ${jobName.join(" ")}`);
  });
});

//Remove one specific mailing require todo id
const removeMailing = asyncHandler(async (job) => {
  await mailing.getJobs("delayed").then((jobs) => {
    jobs.forEach((result) => {
      if (result.data._id.toString() === job._id.toString()) {
        mailing.removeJob(result.id);
      }
    });
  });
});

//Remove all mailing require calendarId
const removeAllMailing = asyncHandler(async (job) => {
  await mailing.getJobs("delayed").then((jobs) => {
    jobs.forEach((result) => {
      if (result.data.calendarId.toString() === job.calendarId.toString()) {
        mailing.removeJob(result.id);
        mailing.getJobs("delayed", { size: 100 }).then((jobs) => {
          const jobIds = jobs.map((job) => job.id);
          console.log(`Job ids: ${jobIds.join(" ")}`);
        });
      }
    });
  });
});

//Update a mailing content require job todo id
const updateMaling = asyncHandler(async (job) => {
  await mailing.getJobs("delayed").then((jobs) => {
    jobs.forEach((result) => {
      if (result.data._id.toString() === job._id.toString()) {
        mailing.removeJob(result.id);
        placeMailing(job);
      }
    });
  });
});

//Send email
mailing.process(
  100,
  asyncHandler(async (job, done) => {
    //Send email to owner
    const user = await User.findById(job.data.owner);
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const txt =
      "Dear customer your lovely calendar is reminging you that you need to do following event: \n" +
      job.data.title +
      "\n This event should be finished by: \n" +
      Date(job.data.end);
    const msg = {
      to: user.email, // Change to your recipient
      from: "harrietzhu0115@gmail.com", // Change to your verified sender
      subject: "One-More-Thing Reminder",
      text: txt,
    };
    sgMail
      .send(msg)
      .then(async () => {
        //Send email to all participant
        const calendar = await Calendar.findById(job.data.calendarId);
        if (calendar) {
          calendar.participant.forEach(async (particpant) => {
            const joined = await User.findOne({ _id: particpant });
            const sgMail = require("@sendgrid/mail");
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const txt =
              "Dear customer your lovely calendar is reminging you that you need to do following event: \n" +
              job.data.title +
              "\n This event should be finished by: \n" +
              Date(job.data.end);
            const msg = {
              to: joined.email, // Change to your recipient
              from: "harrietzhu0115@gmail.com", // Change to your verified sender
              subject: "One-More-Thing Reminder",
              text: txt,
            };
            sgMail
              .send(msg)
              .then(() => {
                console.log("Email sent");
              })
              .catch((error) => {
                console.error(error);
              });
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
    done();
  })
);

module.exports = {
  placeMailing,
  removeMailing,
  updateMaling,
  removeAllMailing,
  emptyMailing,
  checkMailing,
};
