// ==UserScript==
// @name        Demo of VanillaJSDialog
// @namespace   nil
// @match       http://vanilla-js.com/*
// @grant       none
// @version     0.0.1
// @author      -
// @description This is a demo of VanillaJSDialog
// @require     https://update.greasyfork.org/scripts/465421/1188332/Vanilla%20JS%20Dialog.js
// ==/UserScript==

const STORE_VERSION = 1; // 存储版本号 // Store version number
const STORE_key = 'example-key-6324'; // 本地存储的键名 // Key name for local storage
const key_default_tab = 'my-default-tab'; // 默认选项卡的键名 // Key name for default tab

const SETTING_DEFAULT_TAB_0 = "#tab-videos"; // 默认的初始选项卡 // Initial default tab
const settings = {
  defaultTab: SETTING_DEFAULT_TAB_0 // 设置对象，包含默认选项卡 // Settings object containing default tab
};

function getStore() {
  let s = localStorage[STORE_key]; // 从localStorage获取存储的数据 // Get stored data from localStorage
  function resetStore() { // 重置存储 // Reset the store
    let ret = {
      version: 1, // 存储的版本号 // Version number of the store
    };
    localStorage[STORE_key] = JSON.stringify(ret); // 将重置的数据保存到localStorage // Save reset data to localStorage
    return ret; // 返回重置的数据 // Return reset data
  }
  if (!s) return resetStore(); // 如果没有存储数据，则重置存储 // If no data, reset the store
  let obj = null;
  try {
    obj = JSON.parse(s); // 解析存储的JSON数据 // Parse the stored JSON data
  } catch (e) { }
  return obj && obj.version === STORE_VERSION ? obj : resetStore(); // 如果版本匹配，返回数据，否则重置 // Return data if version matches, else reset
}

function setStore(obj) {
  if (!obj || typeof obj !== 'object') return false; // 检查obj是否为对象 // Check if obj is an object
  if (obj.version !== STORE_VERSION) return false; // 检查版本号是否匹配 // Check if version matches
  localStorage[STORE_key] = JSON.stringify(obj); // 将对象序列化并存储 // Serialize and store the object
  return true; // 返回true表示成功 // Return true indicating success
}

function setMyDefaultTab(myDefaultTab) {
  myDefaultTab = convertDefaultTabFromTmpToFinal(myDefaultTab); // 转换临时的默认选项卡到最终的值 // Convert temporary default tab to final value
  let store = getStore(); // 获取当前存储的数据 // Get current stored data
  if (myDefaultTab) {
    store[key_default_tab] = myDefaultTab; // 设置新的默认选项卡 // Set new default tab
    settings.defaultTab = myDefaultTab; // 更新设置中的默认选项卡 // Update default tab in settings
  } else {
    delete store[key_default_tab]; // 删除存储中的默认选项卡 // Delete default tab from store
    settings.defaultTab = SETTING_DEFAULT_TAB_0; // 重置为初始默认选项卡 // Reset to initial default tab
  }
  setStore(store); // 保存更新后的存储数据 // Save updated store data
}

function convertDefaultTabFromTmpToFinal(myDefaultTab_tmp) {
  return myDefaultTab_tmp; // 直接返回临时的默认选项卡 // Directly return the temporary default tab
  /*
  // 以下代码被注释掉了，可以根据需要进行转换
  // The following code is commented out; you can use it for conversion if needed
  let myDefaultTab_final = null;
  if (
    myDefaultTab_tmp &&
    typeof myDefaultTab_tmp === 'string' &&
    /^\#[a-zA-Z\_\-\+]+$/.test(myDefaultTab_tmp)
  ) {
    if (document.querySelector(`.tab-btn[tyt-tab-content="${myDefaultTab_tmp}"]`))
      myDefaultTab_final = myDefaultTab_tmp;
  }
  return myDefaultTab_final;
  */
}

let dialog = null; // 对话框的引用 // Reference to the dialog

function createDialog() {
  // 定义主题属性 // Define theme properties
  const _themeProps_ = {
    dialogBackgroundColor: '#f6f6f6', // 对话框背景色 // Dialog background color
    dialogBackgroundColorDark: '#23252a', // 深色主题的对话框背景色 // Dialog background color for dark theme
    backdropColor: '#b5b5b568', // 背景遮罩颜色 // Backdrop color
    textColor: '#111111', // 文本颜色 // Text color
    textColorDark: '#f0f3f4', // 深色主题的文本颜色 // Text color for dark theme
    zIndex: 60000, // 对话框的z-index // z-index of the dialog
    fontSize: '10pt', // 字体大小 // Font size
    dialogMinWidth: '32px', // 对话框最小宽度 // Minimum width of dialog
    dialogMinHeight: '24px', // 对话框最小高度 // Minimum height of dialog
  };

  // 定义对话框类，继承自 VanillaJSDialog // Define dialog class extending VanillaJSDialog
  class VJSD extends VanillaJSDialog {
    get themeProps() {
      return _themeProps_; // 返回主题属性 // Return theme properties
    }

    isDarkTheme() {
      return document.documentElement.hasAttribute('dark'); // 检查是否是深色主题 // Check if dark theme is active
    }

    onBeforeShow() {
      const es = this.es; // 获取元素存储对象 // Get element storage object
      if ('checkboxSelectionDisplay' in es) {
        es.checkboxSelectionDisplay.textContent = ''; // 清空复选框选择的显示文本 // Clear checkbox selection display text
      }
      const setDefaultTabTick = (myDefaultTab) => {
        for (const checkbox of document.getElementsByName('tabview-tab-default')) {
          checkbox.checked = checkbox.value === myDefaultTab; // 设置与默认选项卡匹配的复选框为选中状态 // Set checkbox checked if it matches default tab
        }
      };
      function getDefaultTabBtnSetting(store) {
        if (!store) {
        } else {
          let myDefaultTab = store[key_default_tab];
          if (
            !myDefaultTab ||
            typeof myDefaultTab !== 'string' ||
            !/^\#[a-zA-Z\_\-\+]+$/.test(myDefaultTab)
          ) {
          } else {
            // 如果需要，可以在此处添加更多逻辑 // If needed, add more logic here
            return setDefaultTabTick(myDefaultTab);
          }
        }
        setDefaultTabTick(null); // 如果没有默认选项卡，取消所有选择 // If no default tab, uncheck all
      }
      let store = getStore(); // 获取存储的数据 // Get stored data
      getDefaultTabBtnSetting(store); // 设置默认选项卡的复选框状态 // Set the checkbox state for default tab
    }

    onFirstCreation() {
      const S = this.S; // 获取全局方法 // Get global methods

      /* 在初始化函数顶部，覆盖全局方法中的图标小部件 */
      /* Override the icon widget in the global method at the top of setup function */
      S.widgets.icon = (iconTag) => {
        return S.ce('i', { className: 'vjsd-icon fa-solid fa-' + iconTag }); // 返回 Font Awesome 图标元素 // Return Font Awesome icon element
      };

      /* 你也可以通过 Userscript Manager 的 import 覆盖 `S.importCSS` */
      /* You might also override `S.importCSS` by the use of Userscript Manager's import */
      S.importCSS(
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/fontawesome.min.css#sha512=SgaqKKxJDQ/tAUAAXzvxZz33rmn7leYDYfBP+YoMRSENhf3zJyx3SBASt/OfeQwBHA1nxMis7mM3EV/oYT6Fdw==',
        // 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/brands.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/solid.min.css#sha512=yDUXOUWwbHH4ggxueDnC5vJv4tmfySpVdIcN1LksGZi8W8EVZv4uKGrQc0pVf66zS7LDhFJM7Zdeow1sw1/8Jw=='
      );

      /* 加载 CSS 文件等 - 你可以在 VanillaJSDialog 中覆盖 `getTheme()` */
      /* Load CSS files, etc - You might override `getTheme()` in VanillaJSDialog */
      this.themeSetup();
    }

    /* init 函数在 setup 函数之后调用 */
    /* init is called after setup function is called */
    init() {
      const S = this.S; // 获取全局方法 // Get global methods

      const es = this.es; // 获取绑定到此对话框的 HTMLElement 存储 // Get HTMLElement storage bound to this dialog

      es.dialog = S.ce(
        'div',
        {
          className: 'vjsd-dialog',
        },
        {
          __vjsd__: '',
        }
      );

      es.dialog.append(
        (es.header = S.ce('div', {
          className: 'vjsd-dialog-header vjsd-hflex',
        })),
        (es.body = S.ce('div', {
          className: 'vjsd-dialog-body vjsd-gap-2 vjsd-overscroll-none vjsd-vflex',
        })),
        (es.footer = S.ce('div', {
          className: 'vjsd-dialog-footer vjsd-hflex',
        }))
      );

      es.header.append(
        S.widgets.icon('circle-info', (a) => {
          // 可以在这里添加额外的设置 // Additional settings can be added here
        }),
        S.widgets.title('Tabview Youtube - Change Default Tab', {
          className: 'vjsd-flex-fill',
        }),
        S.widgets.buttonIcon('square-xmark', {
          'vjsd-clickable': '#dialogXmark',
        })
      );

      const checkBoxChanged = () => {
        let elmChoice1 = [...document.getElementsByName('tabview-tab-default')]
          .filter((e) => e.checked)
          .map((e) => e.value);
        console.assert(elmChoice1.length <= 1); // 确保最多只有一个选中的复选框 // Ensure at most one checkbox is checked
        es.checkboxSelectionDisplay.textContent =
          elmChoice1.length === 1
            ? `The default tab will be set to ${elmChoice1[0]}`
            : `The default tab will be reset.`; // 更新显示的文本 // Update displayed text
      };

      es.body.append(
        S.widgets.labeledRadio(
          'vjsd-checkbox1 vjsd-checkbox-tick',
          'Info',
          (elmLabel, elmInput) => {
            elmInput.name = 'tabview-tab-default';
            elmInput.value = '#tab-info';
            es.checkbox1 = elmInput;
            elmInput.addEventListener('change', checkBoxChanged);
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
            elmInput.addEventListener('change', checkBoxChanged);
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
            elmInput.addEventListener('change', checkBoxChanged);
            elmLabel.style.fontSize = '200%';
          }
        ),
        (es.checkboxSelectionDisplay = S.ce('div', { className: 'vjsd-custom-widget' }))
      );

      const onXMarkClicked = () => {
        this.dismiss(); // 关闭对话框 // Close the dialog
      };

      const onClearClicked = () => {
        es.checkbox1.checked = false;
        es.checkbox2.checked = false;
        es.checkbox3.checked = false;
        checkBoxChanged(); // 更新显示的文本 // Update displayed text
      };

      const onConfirmClicked = () => {
        let myDefaultTab = null;
        for (const checkbox of document.getElementsByName('tabview-tab-default')) {
          if (checkbox.checked) myDefaultTab = checkbox.value;
        }
        myDefaultTab = myDefaultTab || null;
        console.log(myDefaultTab); // 输出选择的默认选项卡 // Output the selected default tab
        setMyDefaultTab(myDefaultTab); // 设置默认选项卡 // Set default tab
        this.dismiss(); // 关闭对话框 // Close the dialog
      };

      const onCancelClicked = () => {
        this.dismiss(); // 关闭对话框 // Close the dialog
      };

      es.footer.append(
        (es.clearButton = S.widgets.button('Clear', {
          'vjsd-clickable': '#clear',
        })),
        S.widgets.space(),
        S.widgets.button('Cancel', {
          'vjsd-clickable': '#cancel',
        }),
        S.widgets.button('Confirm', {
          'vjsd-clickable': '#confirm',
        })
      );

      this.clickable('#cancel', onCancelClicked);
      this.clickable('#clear', onClearClicked);
      this.clickable('#confirm', onConfirmClicked);
      this.clickable('#dialogXmark', onXMarkClicked);

      this.backdrop = 'dismiss'; // 设置背景点击时的行为 // Set behavior when clicking on backdrop
      document.body.appendChild(es.dialog); // 将对话框添加到文档 // Add dialog to document
    }
  }

  VJSD.setup1(); // 初始化设置 // Initialize setup
  return new VJSD(); // 返回新的对话框实例 // Return new dialog instance
}

// 创建一个按钮来触发对话框 // Create a button to trigger the dialog
const button = document.body.appendChild(document.createElement('button')); // 创建一个按钮并添加到页面 // Create a button and add to page
button.textContent = 'Click Me'; // 设置按钮文本 // Set button text
button.style.position = 'fixed'; // 固定定位 // Fixed positioning
button.style.left = '30px'; // 左侧位置 // Left position
button.style.top = '30px'; // 顶部位置 // Top position
button.style.fontSize = '48px'
button.style.padding = '24px'

button.onclick = function () {
  dialog = dialog || createDialog(); // 如果对话框不存在，则创建 // Create dialog if it doesn't exist
  dialog.show(); // 显示对话框 // Show the dialog
};
