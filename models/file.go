package models

import (
	"github.com/astaxie/beego/httplib"
	"io/ioutil"
	"os"
)

func UploadFile(bufer []byte,filename string)string{
	str := "tests/" + filename
	//创建临时文件,转存做的并不漂亮
	ioutil.WriteFile(str,bufer,0644)
	req := httplib.Post("http://gaoxingkun.top:8080/upload")
	req.PostFile("file",str)
	//fmt.Println(req.String())
	ret,_ := req.String()
	//删除文件
	os.Remove(str)
	return ret
}