package com.huai.ssm.service.impl;

import com.huai.ssm.bean.FurnBean;
import com.huai.ssm.mapper.FurnMapper;
import com.huai.ssm.service.FurnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FurnServiceImpl implements FurnService {
    @Autowired
    private FurnMapper furnMapper;

    @Override
    public void save(FurnBean furnBean) {
        furnMapper.save(furnBean);
    }

    @Override
    public List<FurnBean> getAllFurns() {
        return furnMapper.findAllFurns();
    }
}
