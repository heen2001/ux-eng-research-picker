# UX-ENG Research Picker Toolkit
UX-ENG's - UX Research Suggestion Toolkit WebApp

## 1. Pre-requisites
This webapp is based on Foundation 6 for Sites, your computer needs:

- [NodeJS](https://nodejs.org/en/) (0.12 or greater)
- [Git](https://git-scm.com/)

## 2. Install the Foundation CLI 
With the following command:

```bash
npm install foundation-cli --global
```

## 3. Create a blank project
Use this command to set up a blank Foundation for Sites project with this template:

```bash
$ foundation new --framework sites --template zurb
```
When prompted for a project name use:
```bash
$ ux-eng-research-picker
```

## 4. Clone the repository
Clone the repo into a 'temp' folder
```bash
$ git clone https://github.com/heen2001/ux-eng-research-picker.git temp
```

## 5. Move the cloned repo from temp
Copy the cloned repo files into your existing folder
```bash
$ cp -R ./temp/* ./temp/.[^.]* ./ux-eng-research-picker
```
This will override the src folder and configs (once this is done you can delete the temp folder)

## 6. Start the server,
```bash
$ cd ux-eng-research-picker
$ foundation update
$ foundation watch
```

You should now be able to edit and

For more information on Foundation and Foundation CLI visit,

https://github.com/zurb/foundation-cli

http://foundation.zurb.com/sites/docs/
