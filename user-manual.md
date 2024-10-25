### VanillaJSDialog 使用手冊 (VanillaJSDialog User Manual)

---

### 概要 (Overview)

VanillaJSDialog 是一個輕量級 JavaScript 庫，用於在網頁上建立自定義的對話框。此手冊將指導如何使用 VanillaJSDialog 來創建、配置和展示對話框，並提供示例程式碼說明其實際應用。

---

### 安裝 (Installation)

使用 VanillaJSDialog 之前，必須先將其添加為依賴項，例如在 UserScript 腳本中添加 `@require` 行：

```javascript
// @require https://update.greasyfork.org/scripts/465421/1188332/Vanilla%20JS%20Dialog.js
```

### 基本操作 (Basic Usage)

以下程式碼為示例 UserScript，演示了如何使用 VanillaJSDialog 創建和顯示一個對話框：

```javascript
let dialog = null;

function createDialog() {
  // 1. 自定義對話框主題樣式
  const _themeProps_ = {
    dialogBackgroundColor: '#f6f6f6',
    dialogBackgroundColorDark: '#23252a',
    backdropColor: '#b5b5b568',
    textColor: '#111111',
    textColorDark: '#f0f3f4',
    zIndex: 60000,
    fontSize: '10pt',
    dialogMinWidth: '32px',
    dialogMinHeight: '24px',
  };

  // 2. 定義自定義對話框類 (Defining a Custom Dialog Class)
  class VJSD extends VanillaJSDialog {
    // 設定主題屬性
    get themeProps() {
      return _themeProps_;
    }

    // 確定深色主題
    isDarkTheme() {
      return document.documentElement.hasAttribute('dark');
    }

    // 顯示前的操作 (Actions Before Display)
    onBeforeShow() {
      const es = this.es;
    }

    // 首次創建時 (On First Creation)
    onFirstCreation() {
      const S = this.S;
      S.importCSS(
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/fontawesome.min.css'
      );
      this.themeSetup();
    }

    // 初始化對話框 (Dialog Initialization)
    init() {
      const S = this.S;
      const es = this.es;

      es.dialog = S.ce('div', { className: 'vjsd-dialog' }, { '__vjsd__': '' });
      es.dialog.append(
        es.header = S.ce('div', { className: 'vjsd-dialog-header vjsd-hflex' }),
        es.body = S.ce('div', { className: 'vjsd-dialog-body vjsd-gap-2 vjsd-overscroll-none vjsd-vflex' }),
        es.footer = S.ce('div', { className: 'vjsd-dialog-footer vjsd-hflex' })
      );

      // 添加標題與按鈕 (Adding Title and Buttons)
      es.header.append(
        S.widgets.icon('circle-info'),
        S.widgets.title('Tabview Youtube - Change Default Tab', { className: 'vjsd-flex-fill' }),
        S.widgets.buttonIcon('square-xmark', { 'vjsd-clickable': '#dialogXmark' })
      );


      es.body.append(
        S.widgets.labeledRadio(
          'vjsd-checkbox1 vjsd-checkbox-tick',
          'Info',
          (elmLabel, elmInput) => {
            elmInput.name = 'tabview-tab-default';
            elmInput.value = '#tab-info';
            es.checkbox1 = elmInput;
            elmLabel.style.fontSize = '200%'; // 放大字体 // Increase font size
          }
        ),
        S.widgets.labeledRadio(
          'vjsd-checkbox1 vjsd-checkbox-tick',
          'Comment',
          (elmLabel, elmInput) => {
            elmInput.name = 'tabview-tab-default';
            elmInput.value = '#tab-comments';
            es.checkbox2 = elmInput;
            elmLabel.style.fontSize = '200%';
          }
        ),
        S.widgets.labeledRadio(
          'vjsd-checkbox1 vjsd-checkbox-tick',
          'Video',
          (elmLabel, elmInput) => {
            elmInput.name = 'tabview-tab-default';
            elmInput.value = '#tab-videos';
            es.checkbox3 = elmInput;
            elmLabel.style.fontSize = '200%';
          }
        ),
        (es.checkboxSelectionDisplay = S.ce('div', { className: 'vjsd-custom-widget' }))
      );

      es.footer.append(
        S.widgets.button('Clear', { 'vjsd-clickable': '#clear' }),
        S.widgets.button('Cancel', { 'vjsd-clickable': '#cancel' }),
        S.widgets.button('Confirm', { 'vjsd-clickable': '#confirm' })
      );

      document.body.appendChild(es.dialog);
    }
  }

  VJSD.setup1();
  return new VJSD();
}

// 創建觸發按鈕以顯示對話框 (Creating a Button to Trigger the Dialog)
const button = document.body.appendChild(document.createElement('button'));
button.textContent = 'Click Me';
button.style.position = 'fixed';
button.style.left = '0px';
button.style.top = '0px';

button.onclick = function() {
  dialog = dialog || createDialog();
  dialog.show();
}
```

---

### 代碼說明


#### 事件


* onFirstCreation
  - 首次創建時呼叫 （在此，你可以引用CSS）

* init
  - 元件初始化（構成元件）

* onBeforeShow
  - 顯示前呼叫，傳回false可取消打開

* onShow
  - 顯示後呼叫

* onBeforeDismiss
  - 關掉前呼叫，傳回false可取消關掉

* onDismiss
  - 關掉後呼叫


#### 全域變數

* this.es
  - 用來儲存元素。（弱引用）

* this.S
  - 通用函數方法

  * importCSS - 引用CSS


#### 基礎類

* ce - 創建一個div元素，className 為 'vjsd-dialog'，設定屬性 __vjsd__ 為 ''
```js
S.ce('div', { className: 'vjsd-dialog' }, { '__vjsd__': '' });
```

#### 元件類

* 自定義元件 (S.widgets) （批次設定，override）

```js

S.widgets = {
    textbox(f) {
        let elm = S.ce('textarea', { className: 'vjsd-custom-widget sample-textbox' })
        if (f instanceof Function) f(elm);
        return elm;
    },
}
```

* 自定義元件 (S.widgets) （單次設定，新增）
```js
    S.widgets.icon = (iconTag) => {
    return S.ce('i', { className: 'vjsd-icon fa-solid fa-' + iconTag });
    };

```

* title - title文字 （由`VJSD.setup1()`提供）

```js
    S.widgets.title('New User', {
        className :  'vjsd-flex-fill'
    }),
```

* buttonIcon - icon指定 （由`VJSD.setup1()`提供）

```js
    S.widgets.buttonIcon('square-xmark', {
        'vjsd-clickable': '#dialogXmark'
    })
```


* labeledCheckbox - class, label文字，額外處理 （由`VJSD.setup1()`提供）
```js
    S.widgets.labeledCheckbox('vjsd-checkbox1 vjsd-checkbox-tick', 'Item B', (elmLabel, elmInput) => {
        elmInput.name = 'choice1';
        elmInput.value = 'itemB';
        es.checkbox2 = elmInput;
        elmInput.addEventListener('change', checkBoxChanged)
    }),
```

* labeledRadio - class, label文字，額外處理 （由`VJSD.setup1()`提供）
```js
    S.widgets.labeledRadio(
        'vjsd-checkbox1 vjsd-checkbox-tick',
        'Info',
        (elmLabel, elmInput) => {
        elmInput.name = 'tabview-tab-default';
        elmInput.value = '#tab-info';
        es.checkbox1 = elmInput;
        elmLabel.style.fontSize = '200%'; // 放大字体 // Increase font size
        }
    )
```


* button - button文字，定義 vjsd-clickable 的id （由`VJSD.setup1()`提供）
```js
    S.widgets.button('Clear', { 'vjsd-clickable': '#clear' }),
```

* space - 空白，分隔用 （由`VJSD.setup1()`提供）
```js
    S.widgets.space(),
```


* span - （由`VJSD.setup1()`提供）
```js
    S.widgets.span("abc"),
```


* inputText -  （由`VJSD.setup1()`提供）
```js
    S.widgets.inputText(),
```

#### 生成對象方法

* clickable - vjsd-clickable 的 id 所對應的元素，onClick時呼叫 js 函數

```js
this.clickable('#cancel', onCancelClicked);
```

* dismiss - 關掉Dialog

```js
this.dismiss();
```

* show - 開啟Dialog

```js
dialog1.show();
```


* query - `evt.target`外層的`.vjsd-custom-widget`中找`.vjsd-input`（單個）
```js
S.query(evt.target, '.vjsd-custom-widget', '.vjsd-input');
```

* query - `evt.target`外層的`.vjsd-custom-widget`中找`.vjsd-input`（多個）
```js
S.querys(evt.target, '.vjsd-custom-widget', '.vjsd-input');
```

#### 生成對象設定

* backdrop - 按下backdrop時所發生的動作設定
```js
this.backdrop = 'dismiss';
```

#### 其他

* `VJSD.setup1()` - 載入預設的widgets


---

### 配置選項 (Configuration Options)

VanillaJSDialog 提供多種配置選項，以允許用戶在不同主題和樣式中自定義對話框：

1. **對話框樣式配置 (Theme Properties)**  
   使用 `_themeProps_` 來設置背景顏色、字體大小等對話框樣式：

   ```javascript
   const _themeProps_ = {
     dialogBackgroundColor: '#f6f6f6',
     backdropColor: '#b5b5b568',
     zIndex: 60000
   };
   ```

2. **事件處理 (Event Handlers)**  
   `onBeforeShow` 和 `onFirstCreation` 等事件允許用戶在對話框顯示前或首次創建時執行特定操作。

3. **按鈕和按鈕事件 (Buttons and Button Events)**  
   對話框底部可以包含多個按鈕，例如“清除”、“取消”和“確認”，每個按鈕都有其特定的處理函數。示例如下：

   ```javascript
   const onClearClicked = () => {
     // 清除選擇
   };
   const onConfirmClicked = () => {
     // 確認操作
   };
   ```

---

### 常見問題 (FAQ)

1. **如何設置默認標籤頁？**  
   可以使用 `setMyDefaultTab` 函數來設置默認標籤頁：

   ```javascript
   setMyDefaultTab('#tab-videos');
   ```

2. **如何處理對話框背景？**  
   可以在 `_themeProps_` 中配置 `backdropColor` 來修改背景遮罩顏色。

---

### 總結 (Summary)

VanillaJSDialog 是一個簡單易用的工具，用於在網頁上創建高度可配置的對話框。使用者可根據需要配置樣式、添加按鈕，並定義顯示和互動行為。希望本手冊能幫助您快速上手 VanillaJSDialog 並靈活應用它。

## Main Demo

* [Main Demo 1](https://cyfung1031.github.io/Vanilla-JS-Dialog/demo1.html)

## Coding Examples

* [Basic](https://cyfung1031.github.io/Vanilla-JS-Dialog/demo-vanlia-dialog-basic.html)
* [Full](https://cyfung1031.github.io/Vanilla-JS-Dialog/demo-vanlia-dialog-full.html)
