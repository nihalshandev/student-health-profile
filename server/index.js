const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const rimraf = require("rimraf");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:5173" }));
app.use(fileupload());
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("./public/images"));

// DB config
try {
  mongoose.connect("mongodb://localhost:27017/studentHealthProfile");
} catch (error) {
  console.log(error);
  throw new Error("Error connecting to database");
}

// Personal info Schema
const personalInfoSchema = mongoose.Schema({
  uniq_id: String,
  fullName: String,
  mobile: String,
  dob: Object,
  gender: String,
  address: String,
  class: String,
  division: String,
  guardian: String,
  "guardian-phone": String,
});

const healthProfileSchema = mongoose.Schema({
  uniq_id: String,
  height: String,
  weight: String,
  "blood-group": String,
  vision: String,
  hearing: String,
  "currently-doctor": Boolean,
  "allergies-select": Boolean,
  allergies: String,
  "chronic-select": Boolean,
  "chronic-illnesses": String,
  "mental-health": String,
  "family-medical-record": String,
  "previous-medical-condition": String,
  current_health_status: String
});

const vaccinationDetailsSchema = mongoose.Schema({
  vaccination: [
    {
      uniq_id: String,
      vaccination_count: String,
      vaccination: String,
      "vaccination-date": String,
    },
  ],
});

const imageInfoSchema = mongoose.Schema({
  uniq_id: String,
  name: String,
  type: String,
});

const PersonalInfo = mongoose.model("PersonalInfo", personalInfoSchema);
const HealthProfile = mongoose.model("HealthProfile", healthProfileSchema);
const VaccinationDetails = mongoose.model(
  "VaccinationDetails",
  vaccinationDetailsSchema
);
const ImageInfo = mongoose.model("ImageInfo", imageInfoSchema);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/get-student/:uniq_id", (req, res) => {
  PersonalInfo.findOne({ uniq_id: req.params.uniq_id }).then((items) => {
    res.json(items);
    console.log(items);
  });
});

app.get("/get-all-students", (req, res) => {
  PersonalInfo.find().then((items) => res.json(items));
});

app.get("/get-student-health/:uniq_id", (req, res) => {
  HealthProfile.findOne({ uniq_id: req.params.uniq_id }).then((items) =>
    res.json(items)
  );
});

app.get("/get-student-vaccinationdetails/:uniq_id", (req, res) => {
  VaccinationDetails.findOne({ "vaccination.uniq_id": req.params.uniq_id })
    .then((items) => {
      console.log("vaccination items", items);
      console.log("vaccination items end ---------------");
      res.json(items);
    })
    .catch((err) => console.log(err));
});

app.get("/get-image-info/:uniq_id", (req, res) => {
  ImageInfo.findOne({ uniq_id: req.params.uniq_id }).then((item) => {
    res.json(item);
  });
});

app.get("/get-all-image-info", (req, res) => {
  ImageInfo.find().then((items) => {
    res.json(items);
  });
});

app.post("/add-personal-info", (req, res) => {
  try {
    PersonalInfo.create({
      uniq_id: req.body.uniq_id,
      fullName: req.body.fullName,
      mobile: req.body.mobile,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      class: req.body.class,
      division: req.body.division,
      guardian: req.body.guardian,
      "guardian-phone": req.body["guardian-phone"],
    }).then((doc) => {
      console.log(doc);
      res.send("SUCCESS");
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error adding new personal info to database - server");
  }
});

app.post("/upload/:uniq_id", (req, res) => {
  const path = "./public/images/";
  const file = req.files.file;
  const uniq_id = req.params.uniq_id;
  if (file) {
    const image = file;
    console.log(image);
    const ext = image.mimetype.split("/")[1];
    ImageInfo.create({
      uniq_id: uniq_id,
      name: image.name,
      type: image.mimetype,
    })
      .then((doc) => {
        console.log(doc);
        image.mv(`${path}${uniq_id}.${ext}`, (err) => {
          console.log(err);
          if (!err) {
            res.send("IMAGE_UPLOAD_SUCCESS");
          }
        });
      })
      .catch((err) => console.log(err));
  }
});

app.post("/health-profile", (req, res) => {
  try {
    HealthProfile.create({
      uniq_id: req.body.uniq_id,
      height: req.body.height,
      weight: req.body.weight,
      "blood-group": req.body["blood-group"],
      vision: req.body.vision,
      hearing: req.body.hearing,
      "currently-doctor": req.body["currently-doctor"],
      "allergies-select": req.body["allergies-select"],
      allergies: req.body.allergies,
      "chronic-select": req.body["chronic-select"],
      "chronic-illnesses": req.body["chronic-illnesses"],
      "mental-health": req.body["mental-health"],
      "family-medical-record": req.body["family-medical-record"],
      "previous-medical-condition": req.body["previous-medical-condition"],
      current_health_status: req.body.current_health_status
    }).then((doc) => {
      console.log(doc);
      res.send("SUCCESS");
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error adding new health profile to database - server");
  }
});

app.post("/vaccination-details", (req, res) => {
  try {
    VaccinationDetails.create({ vaccination: req.body }).then((doc) => {
      console.log(doc);
      res.send("SUCCESS");
    });
  } catch (error) {
    console.log(error);
  }
});

app.put("/update-photo/:uniq_id", (req, res) => {
  const uniq_id = req.params.uniq_id;
  const path = "./public/images/";
  const image = req.files.file;
  console.log(image);
  ImageInfo.findOne({ uniq_id: uniq_id })
    .then((doc) => {
      if (doc) {
        const imageInfo = doc;
        const oldExt = imageInfo.type.split("/")[1];
        console.log(`odl Ext ${oldExt}`);
        const oldFile = `${path}${uniq_id}.${oldExt}`;
        if (fs.existsSync(oldFile)) {
          fs.unlinkSync(oldFile);
        }
      } else {
        ImageInfo.create({
          uniq_id: uniq_id,
          name: image.name,
          type: image.mimetype,
        })
          .then((doc) => {
            console.log(doc);
            image.mv(`${path}${uniq_id}.${ext}`, (err) => {
              console.log(err);
              if (!err) {
                res.send("IMAGE_UPLOAD_SUCCESS");
              }
            });
          })
          .catch((err) => console.log(err));
      }
    })
    .then(() => {
      const ext = image.mimetype.split("/")[1];
      image.mv(`${path}${uniq_id}.${ext}`, (err) => {
        console.log(err);
        if (!err) {
          res.send("IMAGE_UPLOAD_SUCCESS");
        }
      });
    })
    .then(() => {
      ImageInfo.findOneAndUpdate(
        { uniq_id: uniq_id },
        {
          uniq_id: uniq_id,
          name: req.files.file.name,
          type: req.files.file.mimetype,
        }
      )
        .then((doc) => console.log(doc))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

app.put("/update-health-profile/:uniq_id", (req, res) => {
  HealthProfile.findOneAndUpdate({ uniq_id: req.params.uniq_id }, req.body)
    .then((doc) => {
      console.log("updated health profile", doc);
      if (doc) {
        res.send("SUCCESS");
      } else {
        HealthProfile.create(req.body).then(doc => {
          console.log("updated health profile", doc)
        }).catch(err => console.log(err))
      }
    })
    .catch((err) => console.log(err));
});

app.put("/update-personal-info/:uniq_id", (req, res) => {
  console.log("Personal info update", req.body);
  PersonalInfo.findOneAndUpdate(
    { uniq_id: req.params.uniq_id },
    { $set: req.body }
  )
    .then((doc) => {
      console.log("updated personal info");
      res.send("UPDATE_PERSONALINFO_SUCCESS");
    })
    .catch((err) => {
      console.log(err);
      res.send("UPDATE_PERSONALINFO_FAIL");
    });
});

app.put("/update-vaccination-details/:id", (req, res) => {
  const bodyData = req.body;
  console.log("body data", bodyData);

  VaccinationDetails.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { vaccination: bodyData } }
  )
    .then((doc) => {
      if (doc) {
        console.log(doc);
      } else {
        try {
          VaccinationDetails.create({ vaccination: bodyData }).then((doc) => {
            console.log(doc);
            res.send("SUCCESS");
          });
        } catch (error) {
          console.log(error);
        }
      }
    })
    .catch((err) => console.log(err));

  VaccinationDetails.findOne({ uniq_id: req.params.id }).then((items) => {
    console.log("Updated vaccination table", items);
  });
});

app.delete("/delete-student/:uniq_id", (req, res) => {
  HealthProfile.findOneAndDelete({ uniq_id: req.params.uniq_id })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
  PersonalInfo.findOneAndDelete({ uniq_id: req.params.uniq_id })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
  VaccinationDetails.findOneAndDelete({
    "vaccination.uniq_id": req.params.uniq_id,
  })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
  ImageInfo.findOneAndDelete({ uniq_id: req.params.uniq_id })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
  res.send("Student deleted");
});

app.delete("/delete-photo/:uniq_id/:image_ext", (req, res) => {
  const image = `./public/images/${req.params.uniq_id}.${req.params.image_ext}`;
  fs.unlinkSync(image);
});

app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});
