# pop-validator

---

pop-validator是提示框为气泡的表单校验组件，表单样式使用[alistyle/form](https://github.com/alistyle/form)组件。pop-validator扩展自validator组件，具体api请参看[validator](http://aralejs.org/validator)组件的文档。这个组件只是封装了一些个性化的行为。

---

## 配置说明

### 后端校验报错的显示与消失
写在data-error里，在页面加载后显示，输入框focus时消失，blur后也不会再显示；
```html
<input type="text" class="ali-input" data-error="提示文案" />
```

### 提示文案的显示与隐藏
写在data-explain里，输入框focus时显示提示文案，blur时隐藏；
```html
<input type="text" class="ali-input" data-explain="输入的手机号码或电子邮箱将作为账户名。" />
```

## API
与validator一样，请参看[validator的api](http://aralejs.org/validator/docs/api.html)。
