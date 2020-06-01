package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego/logs"
	"ttms/models"
)

type ScheduleController struct {
	BaseController
}

/*
插入演出计划的信息
 */
func (c *ScheduleController)InsertSchedule()  {
	logs.Debug("添加演出计划")

	data := models.Schedule{}
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//检查权限
	if ok := c.JudgeAuthority(models.MG_SCH); !ok {
		return
	}

	logs.Debug("%s",c.Ctx.Input.RequestBody)
	//获取前端数据
	if err:=json.Unmarshal(c.Ctx.Input.RequestBody,&data);err != nil{
		logs.Error(err)
		c.PackRecode(c.resp,models.RECODE_NODATA)
		return
	}

	logs.Debug("收到的演出计划信息是",data,)

	//把演出计划插入插入数据库
	_,err := models.InsertByTableName(models.SCHEDULE,&data)
	if err != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001 数据库插入错误
		logs.Error(err)
		return
	}

	//添加多对多关系
	studio := models.Studio{StuId:data.SchStuId}
	_,err2 := models.AddManyToMany(models.SCHEDULE,"Studios",&data,studio)

	movie := models.Movie{MovId:data.SchMovId}
	_,err3 := models.AddManyToMany(models.SCHEDULE,"Movies",&data,movie)

	if err2 != nil || err3 != nil {
		logs.Error("err2 = ",err2,"\terr3 = ",err3)
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001
		return
	}

	//返回信息
	c.PackRecode(c.resp,models.RECODE_OK) //成功插入数据库
}
