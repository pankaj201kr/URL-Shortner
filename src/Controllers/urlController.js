const urlModel=require("../models/urlModel")
const shortId=require("shortid")
const validUrl=require("valid-url")



const createUrl=async function(req,res){
    try{
        const baseUrl="http://localhost:3000"
        const longUrl=req.body.longUrl
        if(!validUrl.isUri(baseUrl)){
            return res.status(401).send({status:false,msg:"invalid base url"})
        }
        const urlCode=shortId.generate()
        if(validUrl.isUri(longUrl)){
            let url=await urlModel.findOne({longUrl:longUrl})
            if(url){

                /*
                many times to generated urlcodes
            //     res.status(200).send({status:true,msg:"succesfully created shorturl",data:shortUrl})
            // }else{
                */
                const shortUrl=baseUrl + "/" + urlCode.toLowerCase()
                url = await urlModel.create({urlCode,shortUrl,longUrl})
                res.status(201).send({status:true,msg:"successfull created",data:url})
            }
            
        }else{

            res.status(401).send({status:false,msg:"invalid long url"})
        }

    }catch(err){
         res.status(500).send({msg:err.message})
    }
}

const getUrl = async function (req, res) {
    try {
        const url = await urlModel.findOne({ urlCode: req.params.urlCode });
        if (url) {
          res.status(302).redirect(url.longUrl);
        } else {
          // else return a not found 404 status
          return res.status(404).send({ status: false, msg: "No URL Found" });
        }
      
      // exception handler
    } catch (err) {
      console.error(err);
      res.status(500).send({status:false, msg:err.message});
    }
  };

module.exports.createUrl=createUrl
module.exports.getUrl=getUrl


