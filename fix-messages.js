/**
 * 留言系统修复脚本
 * 此脚本用于修复客户留言无法在管理后台显示的问题
 */

// 在页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('留言系统修复脚本已加载');
    
    // 检查localStorage中的留言数据
    checkCustomerMessages();
    
    // 如果在留言管理页面，尝试重新加载留言
    if (window.location.pathname.includes('messages.html')) {
        console.log('检测到留言管理页面，尝试重新加载留言');
        setTimeout(function() {
            if (typeof loadCustomerMessages === 'function') {
                console.log('调用loadCustomerMessages函数');
                loadCustomerMessages();
            } else {
                console.error('未找到loadCustomerMessages函数');
            }
        }, 500);
    }
    
    // 如果在首页，确保表单提交时正确保存留言
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        console.log('检测到首页，确保表单提交正确保存留言');
        const purchaseForm = document.getElementById('purchaseForm');
        const submitOrderBtn = document.getElementById('submitOrderBtn');
        
        if (purchaseForm && submitOrderBtn) {
            console.log('找到表单和提交按钮，添加事件监听器');
            
            // 添加表单提交事件监听器
            submitOrderBtn.addEventListener('click', function() {
                console.log('表单提交按钮被点击');
                
                // 收集表单数据
                const formData = {
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    email: document.getElementById('email').value,
                    address: document.getElementById('address').value,
                    product: document.getElementById('product').value,
                    quantity: document.getElementById('quantity').value,
                    message: document.getElementById('message').value,
                    isDistributor: document.getElementById('agent').checked,
                    paymentMethod: document.getElementById('payment_method').checked ? 'T/T Payment' : 'Other',
                    timestamp: new Date().toISOString(),
                    status: 'new'
                };
                
                console.log('收集的表单数据:', formData);
                
                // 保存留言数据到localStorage
                saveCustomerMessageFixed(formData);
            });
        }
    }
});

// 检查localStorage中的留言数据
function checkCustomerMessages() {
    const savedMessages = localStorage.getItem('customerMessages');
    
    if (!savedMessages) {
        console.log('未找到留言数据，创建空数组');
        localStorage.setItem('customerMessages', JSON.stringify([]));
    } else {
        try {
            const messages = JSON.parse(savedMessages);
            console.log(`找到 ${messages.length} 条留言数据`);
        } catch (error) {
            console.error('解析留言数据时出错:', error);
            console.log('重置留言数据');
            localStorage.setItem('customerMessages', JSON.stringify([]));
        }
    }
}

// 修复版的保存客户留言函数
function saveCustomerMessageFixed(messageData) {
    console.log('保存客户留言到localStorage (修复版)');
    
    // 从localStorage获取现有留言
    let customerMessages = [];
    const savedMessages = localStorage.getItem('customerMessages');
    
    if (savedMessages) {
        try {
            customerMessages = JSON.parse(savedMessages);
        } catch (error) {
            console.error('解析现有留言数据时出错:', error);
            // 如果解析出错，重置为空数组
            customerMessages = [];
        }
    }
    
    // 添加新留言
    customerMessages.push(messageData);
    
    // 保存回localStorage
    try {
        localStorage.setItem('customerMessages', JSON.stringify(customerMessages));
        console.log('客户留言已成功保存到localStorage');
        console.log('当前留言总数:', customerMessages.length);
    } catch (error) {
        console.error('保存留言数据时出错:', error);
    }
}