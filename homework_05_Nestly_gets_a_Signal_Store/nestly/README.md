## Homework 4 — Form- List new stay

I inspected both your Angular project and NestJS server. There is one important backend detail we need to account for:

- Your Angular homework requirement calls the form field photos: string[].
- Your actual NestJS CreateStayDto accepts image: string, not photos.
- The Stay model also has image: string.
- Therefore, the form can use a FormArray of photo URLs as required, but when submitting we should send the first photo URL as image to the existing POST /api/stays endpoint.
- Your backend also accepts rating optionally, but the homework form doesn't ask the host to enter it, so we can let the server use its default 0.

# Order of completing the task:
1. Create the custom validators: 
src/app/core/validators/stay.validators.ts

2. Add the NewStay interface
src/app/core/models/new-stay.model.ts

3. Update StaysService
src/app/core/services/stays.service.ts
Add the NewStay import and createStay() method.

Why do we convert photos to image?

Your homework says:

photos: string[];

but your actual NestJS DTO says:

image: string;

So this:

image: stay.photos[0]

is necessary for your current backend.

For example, the Angular form might contain:

photos: [
  'https://picsum.photos/600/400',
  'https://picsum.photos/601/400'
]

but the POST request becomes:

{
  "title": "Beautiful Apartment",
  "location": "Skopje",
  "pricePerNight": 80,
  "description": "A beautiful apartment close to the city center.",
  "superhost": true,
  "image": "https://picsum.photos/600/400"
}

That matches your actual CreateStayDto.

4. Create the host form component
src/app/pages/host-new/
host-new.component.ts
host-new.component.html
host-new.component.css

5. Add the /host/new route in  app.routes.ts

6. Add "List your stay" to your existing navbar
Your current app.component.html is actually acting as your navbar