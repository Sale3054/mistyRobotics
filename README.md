# Misty Robotics
Project repo for CU Boulder's 2018-2019 Senior Projects...project for Misty Robotics
--------------------------------------------------------------------------------
# Useful Links
* [Find the Misty **API** docs here](https://docs.mistyrobotics.com/apis/overview/command-architecture/)
* [Find the Misty Robot here](https://www.mistyrobotics.com)
* [Google Drive Directory](https://drive.google.com/open?id=1oL5YVvMhChFNjZVW0gDi5_ol8FCHE3d1)
* [Misty Community Github](https://github.com/MistyCommunity/MistyI/tree/master/Skills)
* File Explorer/Device Portal: Misty_IP:8080
    * Username: Administrator
    * PW: p@ssw0rd 
* [List of changes](https://community.mistyrobotics.com/t/4-17-19-release-notes/1345)
* [New Skill-runner](http://sdk.mistyrobotics.com/skill-runner/)
* [List of REST commands](https://docs.mistyrobotics.com/docs/reference/rest/#reloadskills-alpha)

We require POSTMAN to successfully run the code now. 

In order to _run_ a command:
`POST <IP ADDRESS>/api/skills/start`

With this in the body:
```
{
  "Skill": "16ea6f03-fb87-44d2-8127-ed81e37c26ac"
}
```
Note that the Skill's ID is what is invoked to run the process. In order to retrieve a list of skills s.t. you may run them you need to do: `GET <IP ADDRESS>/api/skills`

The skills are now being uploaded to `User Folders \ Music \ Skills \ Code \`
