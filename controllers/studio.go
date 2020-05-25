package controllers

import (
	"astaxie/beego/logs"
	"encoding/json"
	"ttms/models"
)

type StudioController struct {
	BaseController
}

func (c *StudioController )InsertStudio() {

	data := models.Studio{}
	logs.Debug("添加演出厅")
	resp := make(map[string]interface{})
	defer c.sendJSON(resp)

	logs.Debug("%s",c.Ctx.Input.RequestBody)
	//获取前端数据
	if err:=json.Unmarshal(c.Ctx.Input.RequestBody,&data);err != nil{
		logs.Error(err)
		c.PackRecode(resp,models.RECODE_NODATA)
		return
	}

	logs.Debug("收到的影厅信息",data,data.StuName)

	//插入数据库
	err := models.InsertByTableName("studio",&data)
	if err != nil {
		c.PackRecode(resp,models.RECODE_DBERR) //4001 数据库插入错误
		logs.Error(err)
		return
	}
	//返回信息
	c.PackRecode(resp,models.RECODE_OK) //成功插入数据库
	data.StuName = "第一影厅"
	msg,_ := json.Marshal(data)
	logs.Debug("%s",msg)

}
