// Author: Damien Cheung
// Description: Routes for announcements-related operations
// Last Modified: 2025-03-23

const express = require("express");
const { check } = require("express-validator");

const announcementsController = require("../controllers/announcements-controllers");

const router = express.Router();

router.get("/", announcementsController.getAnnouncements);

router.get("/:aid", announcementsController.getAnnouncementById);

router.post(
  "/create",
  [check("title").not().isEmpty(), check("content").not().isEmpty()],
  announcementsController.createAnnouncement
);

router.patch(
  "/:aid",
  [
    check("title").optional().not().isEmpty(),
    check("content").optional().not().isEmpty(),
  ],
  announcementsController.editAnnouncement
);

router.delete("/:aid", announcementsController.deleteAnnouncement);

module.exports = router;
