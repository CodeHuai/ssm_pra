package com.huai.ssm.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.huai.ssm.bean.FurnBean;
import com.huai.ssm.bean.Msg;
import com.huai.ssm.service.FurnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FurnController {

    @Autowired
    private FurnService furnService;

    @PostMapping("/addFurn")
    public Msg addFurn(@RequestBody FurnBean furnBean) {
        furnService.save(furnBean);
        return Msg.success();
    }

    @GetMapping("/getAll")
    public Msg findAllFurn() {
        List<FurnBean> furnsList = furnService.getAllFurns();
        int total = furnsList.size();
        return Msg.success().add("list", furnsList).add("total", total);
    }

    @PostMapping("/furnPage")
    public Msg getFurnPage(@RequestParam Integer pageNum, @RequestParam Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<FurnBean> furnList = furnService.getAllFurns();
        PageInfo pageInfo = new PageInfo(furnList, pageSize);
        return Msg.success().add("list", pageInfo.getList()).add("total", pageInfo.getTotal()).add("pageNum", pageInfo.getPageNum()).add("pageSize", pageInfo.getPageSize()).add("pages", pageInfo.getPages());

    }

    @PostMapping("/modifyFurn")
    public Msg updateFurn(@RequestBody FurnBean furnBean) {
        int index = furnService.updateFurn(furnBean);
        if (index == 1) {
            FurnBean furnDetail = furnService.getDetailById(furnBean.getId());
            return Msg.success().add("detail", furnDetail);
        } else {
            return Msg.fail();
        }
    }

    @GetMapping("/getFurnDetailById/{id}")
    public Msg getFurnDetail(@PathVariable Integer id) {
        FurnBean detail = furnService.getDetailById(id);
        return Msg.success().add("detail", detail);
    }

    @GetMapping("/removeFurnById/{id}")
    public Msg removeFurnById(@PathVariable Integer id) {
        furnService.removeDataById(id);
        return Msg.success();
    }
}
