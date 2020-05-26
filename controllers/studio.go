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
	logs.Debug("添加演出厅")

	data := models.Studio{}
	defer c.sendJSON(c.resp)

	//检查权限
	if ok := c.JudgeAuthority(models.MG_STU); !ok {
		return
	}

	//获取前端数据
	if err:=json.Unmarshal(c.Ctx.Input.RequestBody,&data);err != nil{
		logs.Error(err)
		c.PackRecode(c.resp,models.RECODE_NODATA)
		return
	}

	logs.Debug("收到的影厅信息",data,data.StuName)

	//插入数据库
	err := models.InsertByTableName("studio",&data)
	if err != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001 数据库插入错误
		logs.Error(err)
		return
	}
	//返回信息
	c.PackRecode(c.resp,models.RECODE_OK) //成功插入数据库
	data.StuName = "第一影厅"
	msg,_ := json.Marshal(data)
	logs.Debug("%s",msg)

}

func (c *StudioController)DeleteStudio() {

	logs.Debug("删除演出厅")
	defer c.sendJSON(c.resp)

	//检查权限
	if ok := c.JudgeAuthority(models.MG_STU); !ok {
		return
	}

	data := models.Studio{}

	id,err := c.GetInt64("stu_id")
	if err != nil {
		c.PackRecode(c.resp,models.RECODE_NODATA) //4002 没有收到ID
		return
	}

	logs.Debug("要删除的演出厅的ID",id)
	data.StuId = id
	err2 := models.DeleteByTablename(models.STUDIO,&data)
	if err2 != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001 数据库出错
		return
	}

	c.PackRecode(c.resp,models.RECODE_OK)
}
