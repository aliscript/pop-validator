# 演示文档

---

````html
<form id="form" class="ali-form">
    <div class="ali-form-item">
        <label class="ali-label" for="number"><span class="ali-form-required"></span>手机号码：</label>
        <input id="number" class="ali-input" name="number" placeholder="11位数字" data-explain="请输入手机号码" />
    </div>

    <div class="ali-form-item">
        <input class="ali-button ali-button-morange" value="确定" type="submit">
    </div>
</form>
````

````js
seajs.use(['pop-validator', '$'], function(PopValidator, $){
    $(function(){
        var validator = new PopValidator({
            element: "#form"
        });

        validator.addItem({
            element: '[name=number]',
            required: true,
            rule: 'mobile',
            display: "手机号码"
        });
    });
});
````
