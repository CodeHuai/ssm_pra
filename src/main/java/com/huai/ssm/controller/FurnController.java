package com.huai.ssm.controller;

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
}
