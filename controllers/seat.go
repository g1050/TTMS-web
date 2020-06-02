package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego/logs"
	"ttms/models"
)

type SeatController struct {
	BaseController
}

/*
查询演出厅的座位信息
 */
func (c *SeatController)GetSeat() {
	logs.Debug("查询座位")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	//检查权限
	if ok := c.JudgeAuthority(models.MG_STU); !ok {
		return
	}

	id, err := c.GetInt64("stu_id")
	if err != nil {
		c.PackRecode(c.resp, models.RECODE_NODATA) //4002 没有收到ID
		return
	}
	logs.Debug("要查询的座位的演出厅ID是", id)

	var seats []*models.Seat
	//获取座位信息
	num, err2 := models.QuertOneToMany(models.SEAT, "Studio", id, &seats)
	if err2 != nil {
		c.PackRecode(c.resp, models.RECODE_DBERR)
		return
	}

	logs.Debug("%d seats read\n", num)

	c.resp["sum"] =  num
	c.resp["data"] = seats
	c.PackRecode(c.resp,models.RECODE_OK)
}

/*
修改座位信息,根据ID修改座位的状态
 */
func (c *SeatController)UpdateSeat() {
	logs.Debug("更改座位信息")
	c.resp = make(map[string]interface{})
	defer c.sendJSON(c.resp)

	if ok := c.JudgeAuthority(models.MG_STU); !ok {
		return
	}


	data := models.Seat{}
	json.Unmarshal(c.Ctx.Input.RequestBody,&data)
	logs.Debug("从前段获取的数据是",data)

	_,err := models.UpdateByTablenameAndField(models.SEAT,"st_status",&data)


	//修改可用座位数字
	//一对多反向查询演出厅
	studio := models.Studio{}
	err2 := models.ManyToOneReverse(models.STUDIO,data.StId,&studio)
	logs.Debug("查询到的演出厅信息是:",studio)

	if data.StStatus == 1{
		studio.StuAvaSeat -= 1
	} else {
		studio.StuAvaSeat += 1
	}
	models.UpdateByTablenameAndField(models.STUDIO,"stu_ava_seat",&studio)
	//返回结果
	if err != nil || err2 != nil{
		logs.Error(err,err2)
		c.PackRecode(c.resp,models.RECODE_DBERR) //4001　插入失败
		return
	}


	c.PackRecode(c.resp,models.RECODE_OK)
}