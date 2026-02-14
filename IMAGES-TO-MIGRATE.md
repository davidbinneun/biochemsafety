# Complete List of Images to Migrate

## Summary
- **Total images**: 19 images from external sources
- **From base44.app**: 16 images (service icons and detail images)
- **From biochemsafety.com**: 1 image (laboratory GIF)
- **Already on Supabase**: 2 images (logo and WhatsApp image - may need to stay or move)

---

## 1. Service Icons (8 images)

These are used in the services grid on the homepage:

1. **beakers1.png** - Chemistry safety icon
   - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/5a3fedb89_beakers1.png`
   - Used in: [supabase/init.sql:217](c:\dev\biochemsafety\supabase\init.sql#L217)

2. **microscope1.png** - Lab safety icon
   - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/6d52c7867_microscope1.png`
   - Used in: [supabase/init.sql:228](c:\dev\biochemsafety\supabase\init.sql#L228)

3. **health_icon.png** - Health safety icon
   - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/f9a7bcd75_health_13779529.png`
   - Used in: [supabase/init.sql:239](c:\dev\biochemsafety\supabase\init.sql#L239)

4. **carbon-nanotube.png** - Nano safety icon
   - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/a7fc30d4d_carbon-nanotube.png`
   - Used in: [supabase/init.sql:248](c:\dev\biochemsafety\supabase\init.sql#L248)

5. **reliability.png** - Training icon
   - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/822603510_reliability.png`
   - Used in: [supabase/init.sql:259](c:\dev\biochemsafety\supabase\init.sql#L259)

6. **chemistry.png** - Audits icon
   - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/251883fab_chemistry.png`
   - Used in: [supabase/init.sql:270](c:\dev\biochemsafety\supabase\init.sql#L270)

7. **risk-assessment.png** - Risk assessment icon
   - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/edee75f24_risk-assessment.png`
   - Used in: [supabase/init.sql:280](c:\dev\biochemsafety\supabase\init.sql#L280)

8. **flask1.png** - Content block icon
   - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/e21aa4755_flask1.png`
   - Used in: [olddatabase/ContentBlock_export.csv](c:\dev\biochemsafety\olddatabase\ContentBlock_export.csv) (poisons-permit service detail)

9. **gloves1.png** - Content block icon
   - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/ac05db7fe_gloves1.png`
   - Used in: [olddatabase/ContentBlock_export.csv](c:\dev\biochemsafety\olddatabase\ContentBlock_export.csv) (safety-manager service detail)

---

## 2. Service Detail Images (7 images)

These are larger images shown on individual service detail pages:

10. **DBPIndChem.png** - Chemistry detail image
    - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/a700a2f98_DBPIndChempng.png`
    - Used in: [supabase/init.sql:218](c:\dev\biochemsafety\supabase\init.sql#L218)

11. **workingathoodpng.png** - Lab hood image
    - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/29de7b4f0_workingathoodpng.png`
    - Used in: [supabase/init.sql:229](c:\dev\biochemsafety\supabase\init.sql#L229)

12. **health_image.png** - Health safety detail
    - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/7f551b451_.png`
    - Used in: [supabase/init.sql:240](c:\dev\biochemsafety\supabase\init.sql#L240)

13. **scientist-nanotech.png** - Nanotech lab image
    - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/dc78f18db_ac6ee38af_Scientistinnanotechla.png`
    - Used in: [supabase/init.sql:249](c:\dev\biochemsafety\supabase\init.sql#L249)

14. **avpovi.png** - Training detail image
    - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/6f184e7ae_avpovi.png`
    - Used in: [supabase/init.sql:260](c:\dev\biochemsafety\supabase\init.sql#L260)

15. **scientist-bottles.png** - Audit detail image
    - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/2278f1947_Scientistpointingatcolorfulbottles.png`
    - Used in: [supabase/init.sql:271](c:\dev\biochemsafety\supabase\init.sql#L271)

16. **risk-image.png** - Risk assessment detail
    - Current: `https://base44.app/api/apps/693ff28dde58acabbdf9d717/files/public/693ff28dde58acabbdf9d717/13633c81c_.png`
    - Used in: [supabase/init.sql:281](c:\dev\biochemsafety\supabase\init.sql#L281)

---

## 3. Hero Section (1 image)

17. **laboratory.gif** - Animated lab GIF in hero section
    - Current: `https://www.biochemsafety.com/wp-content/uploads/2021/10/Laboratory-1.gif`
    - Used in: [src/components/home/Hero.jsx:82](c:\dev\biochemsafety\src\components\home\Hero.jsx#L82)
    - **Note**: This is from biochemsafety.com (not .org). If you have a different URL from biochemsafety.org, please provide it.

---

## 4. Already on Supabase Storage (2 images)

These images are already hosted on Supabase Storage (different project). You may want to migrate them to your current project's storage:

18. **diana_logo2.png** - Logo in header
    - Current: `https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693ff28dde58acabbdf9d717/1a39d3806_diana_logo2.png`
    - Used in: [src/Layout.jsx:113](c:\dev\biochemsafety\src\Layout.jsx#L113)

19. **WhatsApp contact image** - WhatsApp button image
    - Current: `https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693ff28dde58acabbdf9d717/3e18a6447_WhatsAppImage2026-01-26at000621.jpeg`
    - Used in: [src/Layout.jsx:123](c:\dev\biochemsafety\src\Layout.jsx#L123)

---

## Files That Need Updating After Upload

Once you upload all images to Supabase Storage bucket "images", these files need to be updated with new URLs:

1. **[supabase/init.sql](c:\dev\biochemsafety\supabase\init.sql)** - Update all service icon_url and image_url fields (lines 217-281)
2. **[src/components/home/Hero.jsx](c:\dev\biochemsafety\src\components\home\Hero.jsx)** - Update laboratory GIF URL (line 82)
3. **[src/Layout.jsx](c:\dev\biochemsafety\src\Layout.jsx)** - Optionally update logo and WhatsApp images (lines 113, 123)

---

## New Supabase Storage URLs Format

After uploading to the "images" bucket, URLs will be:

```
https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/images/{filename}
```

For example:
- `https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/images/beakers1.png`
- `https://bujzzaqciigxarpggcqt.storage.supabase.co/storage/v1/object/public/images/laboratory.gif`

---

## Notes

- All images from base44.app (16 total) are PNG files
- The laboratory image is a GIF file
- The two images already on Supabase are PNG and JPEG respectively
- The downloaded images from base44.app are currently stored in [scripts/temp-images/](c:\dev\biochemsafety\scripts\temp-images) (if the migration script was run)
