package controllers

import (
	"astaxie/beego/logs"
	"encoding/json"
	"strconv"
	"ttms/models"
)

type StudioController struct {
	BaseController
}

func (c *StudioController )InsertStudio() {
	logs.Debug("添加演出厅")

	data := models.Studio{}
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//检查权限
	if ok := c.JudgeAuthority(models.MG_STU); !ok {
		return
	}

	logs.Debug("%s",c.Ctx.Input.RequestBody)
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
	c.resp = make(map[string]interface{})
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

func (c *StudioController) GetStudioData() {
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//验证权限
	if ok := c.JudgeAuthority(models.MG_STU); !ok {
		return
	}

	pageStr := c.Ctx.Input.Param(":page")
	page,_ := strconv.Atoi(pageStr)
	logs.Debug("获取影厅信息第",page,"页")

	slice := []models.Studio{}
	//返回情况返回相应数据
	//models.T()
	err,sum,ret2 := models.GetDataByNumAndOffset(models.STUDIO,&slice,10,(page-1)*10,"stu_id")
	if err != nil || ret2 == 0{
		logs.Error("查询n条数据出错")
		c.resp["sum"] = 0
		c.PackRecode(c.resp,models.RECODE_DBERR) //数据库错误
		return
	}

	c.PackRecode(c.resp,models.RECODE_OK)
	c.resp["sum"] = sum
	c.resp["data"] = slice
	logs.Debug("从数据库存中获得数据",slice)
	logs.Debug(c.resp)
}

func (c *StudioController)UpdateStudio() {

	logs.Debug("更新影厅信息")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_STU); !ok {
		return
	}


	data := models.Studio{}
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)
	logs.Debug("从前段获取的数据是",data)

	//修改
	err := models.UpdateByTablename(models.STUDIO,&data)

	//返回结果
	if err != nil {
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001　插入失败
		return
	}
	c.PackRecode(c.resp,models.RECODE_OK)


}