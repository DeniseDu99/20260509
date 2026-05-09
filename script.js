// 应用管理后台保存的设置函数
// 将函数设为全局可访问，以便管理后台可以调用
window.applyAdminSettings = function() {
    console.log('应用管理后台设置 - 开始'); // 添加调试信息
    // 从localStorage获取保存的设置
    const savedSettings = localStorage.getItem('websiteSettings');
    const savedContactSettings = localStorage.getItem('contactSettings');
    const lastUpdated = localStorage.getItem('settingsLastUpdated');
    
    console.log('设置最后更新时间:', lastUpdated);
    
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            console.log('应用网站设置:', settings); // 添加调试信息
        } catch (error) {
            console.error('解析网站设置时出错:', error);
            return; // 如果解析失败，退出函数
        }
        
        try {
            const settings = JSON.parse(savedSettings); // 重新解析一次
            
            // 应用基本设置
            if (settings.siteName) {
                document.title = settings.siteName;
                const logoElements = document.querySelectorAll('.logo h1, .footer-logo h2');
                console.log('找到logo元素:', logoElements.length);
                logoElements.forEach(el => {
                    if (el) {
                        el.textContent = settings.siteName;
                        console.log('已更新logo文本为:', settings.siteName);
                    }
                });
            }
        
        // 应用SEO设置
        if (settings.metaDescription) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.name = 'description';
                document.head.appendChild(metaDescription);
                console.log('创建了新的meta description标签');
            }
            metaDescription.content = settings.metaDescription;
            console.log('已更新meta description为:', settings.metaDescription);
        }
        
        if (settings.metaKeywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = 'keywords';
                document.head.appendChild(metaKeywords);
                console.log('创建了新的meta keywords标签');
            }
            metaKeywords.content = settings.metaKeywords;
            console.log('已更新meta keywords为:', settings.metaKeywords);
        }
        
        // 应用颜色设置
        if (settings.primaryColor || settings.secondaryColor) {
            let styleElement = document.getElementById('dynamic-styles');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'dynamic-styles';
                document.head.appendChild(styleElement);
                console.log('创建了新的动态样式元素');
            }
            
            let cssRules = '';
            if (settings.primaryColor) {
                cssRules += `
                    .btn-primary, .section-header h2:after, .feature-icon, .step-number {
                        background-color: ${settings.primaryColor};
                    }
                    a, .logo h1, .footer-logo h2 {
                        color: ${settings.primaryColor};
                    }
                `;
                console.log('应用主色调:', settings.primaryColor);
            }
            
            if (settings.secondaryColor) {
                cssRules += `
                    .btn-secondary {
                        background-color: ${settings.secondaryColor};
                    }
                `;
                console.log('应用次要色调:', settings.secondaryColor);
            }
            
            styleElement.textContent = cssRules;
        }
        
        // 应用字体设置
        if (settings.fontFamily) {
            document.body.style.fontFamily = settings.fontFamily;
            console.log('应用字体设置:', settings.fontFamily);
        }
    }
    
    // 应用联系方式设置
    if (savedContactSettings) {
        try {
            const contactSettings = JSON.parse(savedContactSettings);
            console.log('应用联系方式设置:', contactSettings); // 添加调试信息
            
            const contactElements = document.querySelectorAll('.contact-info .info-item');
            console.log('找到联系信息元素:', contactElements.length);
            
            contactElements.forEach(item => {
                const icon = item.querySelector('i');
                if (!icon) return;
                
                if (icon.classList.contains('fa-envelope') && contactSettings.email) {
                    const emailElement = item.querySelector('p');
                    if (emailElement) {
                        emailElement.textContent = contactSettings.email;
                        console.log('已更新邮箱为:', contactSettings.email);
                    }
                } else if (icon.classList.contains('fa-phone') && contactSettings.phone) {
                    const phoneElement = item.querySelector('p');
                    if (phoneElement) {
                        phoneElement.textContent = contactSettings.phone;
                        console.log('已更新电话为:', contactSettings.phone);
                    }
                } else if (icon.classList.contains('fa-map-marker-alt') && contactSettings.address) {
                    const addressElement = item.querySelector('p');
                    if (addressElement) {
                        addressElement.textContent = contactSettings.address;
                        console.log('已更新地址为:', contactSettings.address);
                    }
                }
            });
            
            // 更新社交媒体链接
            const socialLinks = document.querySelectorAll('.social-links a');
            console.log('找到社交媒体链接:', socialLinks.length);
            
            if (socialLinks.length > 0 && contactSettings.facebook) {
                socialLinks[0].href = contactSettings.facebook;
                console.log('已更新Facebook链接为:', contactSettings.facebook);
            }
            if (socialLinks.length > 1 && contactSettings.twitter) {
                socialLinks[1].href = contactSettings.twitter;
                console.log('已更新Twitter链接为:', contactSettings.twitter);
            }
            if (socialLinks.length > 2 && contactSettings.instagram) {
                socialLinks[2].href = contactSettings.instagram;
                console.log('已更新Instagram链接为:', contactSettings.instagram);
            }
            if (socialLinks.length > 3 && contactSettings.linkedin) {
                socialLinks[3].href = contactSettings.linkedin;
                console.log('已更新LinkedIn链接为:', contactSettings.linkedin);
            }
        } catch (error) {
            console.error('应用联系方式设置时出错:', error);
        }
    } else {
        console.log('未找到保存的联系方式设置');
    }
    
    console.log('应用管理后台设置 - 完成');
    
    // 更新T/T支付信息
    updateTTPaymentInfo();
    
    // 加载博客文章（如果在博客页面）
    if (window.location.pathname.includes('blog.html')) {
        loadBlogPosts();
    }
}

// 更新T/T支付信息
function updateTTPaymentInfo() {
    const ttPaymentInfo = document.getElementById('ttPaymentInfo');
    if (ttPaymentInfo) {
        // 确保显示正确的公司账户信息
        ttPaymentInfo.innerHTML = `
            <h4 style="margin-top: 0; color: #333;">T/T Payment Information</h4>
            <p><strong>Company Name:</strong> Shanghai Toex Pet Products Co., Ltd.</p>
            <p><strong>Bank:</strong> Bank of China</p>
            <p><strong>Account Number:</strong> 101014822148226</p>
            <p><strong>Swift Code:</strong> BKCHCNBJ300</p>
            <p><strong>Bank Address:</strong> Shanghai Branch, China</p>
        `;
    }
}

// 加载博客文章
function loadBlogPosts() {
    console.log('加载博客文章'); // 添加调试信息
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;
    
    // 从localStorage获取博客数据
    const savedBlogs = localStorage.getItem('blogPosts');
    if (!savedBlogs) {
        console.log('没有找到保存的博客文章');
        return;
    }
    
    const blogPosts = JSON.parse(savedBlogs);
    console.log('找到博客文章:', blogPosts.length);
    
    // 清空现有的博客卡片（保留前4个默认卡片）
    const existingCards = blogGrid.querySelectorAll('.blog-card');
    const defaultCardsCount = Math.min(existingCards.length, 4);
    
    // 添加新的博客卡片
    blogPosts.forEach((blog, index) => {
        // 创建博客卡片
        const blogCard = document.createElement('div');
        blogCard.className = 'blog-card';
        
        // 格式化日期
        let publishDate = '最近发布';
        if (blog.publishDate) {
            const date = new Date(blog.publishDate);
            publishDate = date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        // 设置博客卡片内容
        blogCard.innerHTML = `
            <div class="blog-image">
                <img src="images/blog${(index % 4) + 1}.svg" alt="${blog.blogTitle}">
            </div>
            <div class="blog-content">
                <div class="blog-date">
                    <i class="far fa-calendar-alt"></i> ${publishDate}
                </div>
                <h3><a href="#">${blog.blogTitle}</a></h3>
                <p>${blog.blogExcerpt}</p>
                <a href="#" class="read-more">阅读更多 <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        
        // 将博客卡片添加到网格中
        blogGrid.appendChild(blogCard);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // 检查是否有设置更新标志，并应用管理后台保存的设置
    const settingsUpdated = localStorage.getItem('settingsUpdated');
    console.log('设置更新状态:', settingsUpdated);
    
    // 无论如何都应用设置，确保每次页面加载时都应用最新设置
    applyAdminSettings();
    
    // 如果有设置更新标志，清除它
    if (settingsUpdated === 'true') {
        console.log('检测到设置已更新，应用新设置');
        localStorage.setItem('settingsUpdated', 'false');
    }
    
    // Submit Order button functionality
    const submitOrderBtn = document.getElementById('submitOrderBtn');
    const purchaseForm = document.getElementById('purchaseForm');

    
    if (submitOrderBtn && purchaseForm) {
        console.log('找到提交按钮和表单元素'); // 添加调试信息
        
        // 确保只添加一次事件监听器
        submitOrderBtn.onclick = null;
        
        // 添加新的事件监听器
        submitOrderBtn.onclick = function() {
            console.log('提交订单按钮被点击'); // 添加调试信息
            
            // 基本表单验证
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const address = document.getElementById('address').value.trim();
            const product = document.getElementById('product').value;
            const quantity = document.getElementById('quantity').value;
            
            console.log('表单数据:', { name, phone, email, address, product, quantity }); // 添加调试信息
            
            // 验证必填字段
            let isValid = true;
            
            // 清除所有字段的错误提示
            const formFields = ['name', 'phone', 'email', 'address', 'product'];
            formFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    removeFieldError(field);
                    field.style.borderColor = '#ddd';
                }
            });
            
            // 验证姓名
            const nameField = document.getElementById('name');
            if (!name) {
                nameField.style.borderColor = '#e74c3c';
                showFieldError(nameField, 'Name is required');
                isValid = false;
            }
            
            // 验证联系方式
            const phoneField = document.getElementById('phone');
            if (!phone) {
                phoneField.style.borderColor = '#e74c3c';
                showFieldError(phoneField, 'Phone number is required');
                isValid = false;
            } else {
                // 使用更宽松的电话号码验证，支持国际格式
                const phoneRegex = /^\+?(\d{1,4}[\s\-\.\,]?)?(\(?\d{1,6}\)?)?([\s\-\.\,]?\d{1,5}){1,4}$/;
                if (!phoneRegex.test(phone)) {
                    phoneField.style.borderColor = '#e74c3c';
                    showFieldError(phoneField, 'Invalid phone number');
                    isValid = false;
                }
            }
            
            // 验证邮箱
            const emailField = document.getElementById('email');
            if (!email) {
                emailField.style.borderColor = '#e74c3c';
                showFieldError(emailField, 'Email is required');
                isValid = false;
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    emailField.style.borderColor = '#e74c3c';
                    showFieldError(emailField, 'Invalid email address');
                    isValid = false;
                }
            }
            
            // 验证收货地址
            const addressField = document.getElementById('address');
            if (!address) {
                addressField.style.borderColor = '#e74c3c';
                showFieldError(addressField, 'Shipping address is required');
                isValid = false;
            }
            
            // 验证产品选择
            const productField = document.getElementById('product');
            if (!product) {
                productField.style.borderColor = '#e74c3c';
                showFieldError(productField, 'Please select a product');
                isValid = false;
            }
            
            if (!isValid) {
                console.log('表单验证失败'); // 添加调试信息
                return;
            }
            
            console.log('表单验证通过，显示成功信息'); // 添加调试信息
            
            // 收集表单数据，可以在这里添加发送到后台的代码
            const formData = {
                name: name,
                phone: phone,
                email: email,
                address: address,
                product: product,
                quantity: quantity,
                message: document.getElementById('message').value,
                isDistributor: document.getElementById('agent').checked,
                paymentMethod: document.getElementById('payment_method').checked ? 'T/T Payment' : 'Other',
                timestamp: new Date().toISOString(),
                status: 'new'
            };
            
            console.log('准备发送到后台的数据:', formData);
            
            // 保存留言数据到localStorage
            saveCustomerMessage(formData);
            
            // 显示成功消息
            const orderSuccessModal = document.getElementById('orderSuccessModal');
            if (orderSuccessModal) {
                // 修改模态框内容为英文
                orderSuccessModal.innerHTML = `
                    <div class="modal-content">
                        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                        <h3>Thank you for your order!</h3>
                        <p>We will contact you as soon as possible.</p>
                        <button class="btn-primary close-modal">OK</button>
                    </div>
                `;
                
                // 显示模态框
                orderSuccessModal.style.display = 'block';
                console.log('显示成功提示模态框'); // 添加调试信息
                
                // 添加发送数据到后台的逻辑
                fetch('https://api.example.com/submit-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .catch(error => {
                    console.error('Error:', error);
                    // 可添加错误处理
                });
                
                // 更新按钮状态
                submitOrderBtn.innerHTML = 'Submitted <i class="fas fa-check"></i>';
                submitOrderBtn.style.backgroundColor = '#2ecc71';
                submitOrderBtn.disabled = true;
                
                // 关闭模态框处理
                const closeModal = orderSuccessModal.querySelector('.close-modal');
                closeModal.onclick = function() {
                    orderSuccessModal.style.display = 'none';
                    purchaseForm.reset();
                    submitOrderBtn.innerHTML = 'Submit Order';
                    submitOrderBtn.style.backgroundColor = '';
                    submitOrderBtn.disabled = false;
                };
            } else {
                console.error('未找到成功提示模态框元素'); // 添加错误信息
                // 如果模态框不存在，至少提供一些反馈
                alert('Order submitted successfully! We will contact you soon.');
            }
            
            // 不再显示额外的弹窗表单
            // 数据已经收集并准备好发送到后台
        };
        
        // 保存客户留言到localStorage
        function saveCustomerMessage(messageData) {
            // 从localStorage获取现有留言
            let customerMessages = [];
            const savedMessages = localStorage.getItem('customerMessages');
            
            if (savedMessages) {
                customerMessages = JSON.parse(savedMessages);
            }
            
            // 添加新留言
            customerMessages.push(messageData);
            
            // 保存回localStorage
            localStorage.setItem('customerMessages', JSON.stringify(customerMessages));
            console.log('客户留言已保存到localStorage');
        }
    } else {
        console.error('未找到提交按钮或表单元素'); // 添加错误信息
    }
    
    // 表单提交逻辑已在上方完成，不再需要额外的弹窗表单处理代码

    // 移动菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const body = document.body;
    
    if (mobileMenuBtn) {
        // 创建移动菜单
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-menu-close"><i class="fas fa-times"></i></div>
            <ul>
                <li><a href="#home">首页</a></li>
                <li><a href="#features">产品特性</a></li>
                <li><a href="#how-it-works">使用方法</a></li>
                <li><a href="#testimonials">客户评价</a></li>
                <li><a href="#pricing">价格方案</a></li>
                <li><a href="blog.html">博客</a></li>
                <li><a href="#faq">常见问题</a></li>
                <li><a href="https://toexpet.en.alibaba.com/productgrouplist-918274351/licemachine.html" class="btn-primary">立即购买</a></li>
            </ul>
        `;
        body.appendChild(mobileMenu);
        
        // 移动菜单打开按钮
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.add('active');
        });
        
        // 移动菜单关闭按钮
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
            });
        }
        
        // 点击菜单项关闭菜单
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
            });
        });
    }
    
    // FAQ 折叠功能
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', function() {
            // 关闭其他打开的FAQ项
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherToggle = otherItem.querySelector('.faq-toggle i');
                    otherToggle.className = 'fas fa-plus';
                }
            });
            
            // 切换当前FAQ项
            item.classList.toggle('active');
            
            // 更改图标
            if (item.classList.contains('active')) {
                toggle.innerHTML = '<i class="fas fa-minus"></i>';
            } else {
                toggle.innerHTML = '<i class="fas fa-plus"></i>';
            }
        });
    });
    
    // 平滑滚动
    const navLinks = document.querySelectorAll('header nav a, .hero-buttons a, .footer-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 检查链接是否指向页面内部锚点
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // 减去导航栏高度
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // 用户指南视频切换功能
    const toggleVideoBtn = document.getElementById('toggle-video');
    const videoContainer = document.getElementById('video-container');
    
    if (toggleVideoBtn && videoContainer) {
        toggleVideoBtn.addEventListener('click', function() {
            videoContainer.classList.toggle('active');
            
            // Change button text
            if (videoContainer.classList.contains('active')) {
                toggleVideoBtn.innerHTML = '<i class="fas fa-times-circle"></i> Close Video';
            } else {
                toggleVideoBtn.innerHTML = '<i class="fas fa-play-circle"></i> Watch Tutorial';
                
                // If video is playing, pause it
                const video = videoContainer.querySelector('video');
                if (video) {
                    video.pause();
                }
            }
        });
    }
    
    // 直接支付按钮处理
    const paymentBtn = document.querySelector('.payment-btn');
    
    if (paymentBtn) {
        // 收集表单数据用于跟踪
        paymentBtn.addEventListener('click', function(e) {
            // Ensure purchaseForm is available (it's a const from the outer scope)
            if (!purchaseForm) {
                console.error('Purchase form not found for payment button click!');
                return;
            }

            const nameField = document.getElementById('name');
            const phoneField = document.getElementById('phone');
            const emailField = document.getElementById('email');

            let isValid = true;

            // --- Name Validation ---
            if (nameField) { // Check if the element exists
                if (!nameField.value.trim()) {
                    nameField.style.borderColor = '#e74c3c';
                    showFieldError(nameField, 'Name is required');
                    isValid = false;
                } else {
                    nameField.style.borderColor = '#ddd'; // Reset border if valid
                    removeFieldError(nameField); // Clear previous error message
                }
            } else {
                console.warn('Name field not found for validation.');
            }

            // --- Phone Validation ---
            if (phoneField) { // Check if the element exists
                if (!phoneField.value.trim()) {
                    phoneField.style.borderColor = '#e74c3c';
                    showFieldError(phoneField, 'Phone number is required');
                    isValid = false;
                } else {
                    const phoneRegex = /^\+?(\d{1,4}[\s-.]?)?(\(?\d{1,6}\)?)?([\s\-.]?\d{1,5}){1,4}$/;
                    if (!phoneRegex.test(phoneField.value.trim())) {
                        phoneField.style.borderColor = '#e74c3c';
                        showFieldError(phoneField, 'Invalid phone number');
                        isValid = false;
                    } else {
                        phoneField.style.borderColor = '#ddd'; // Reset border if valid
                        removeFieldError(phoneField); // Clear previous error message
                    }
                }
            } else {
                console.warn('Phone field not found for validation.');
            }

            // --- Email Validation ---
            if (emailField) { // Check if the element exists
                if (!emailField.value.trim()) {
                    emailField.style.borderColor = '#e74c3c';
                    showFieldError(emailField, 'Email is required');
                    isValid = false;
                } else {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(emailField.value.trim())) {
                        emailField.style.borderColor = '#e74c3c';
                        showFieldError(emailField, 'Invalid email address');
                        isValid = false;
                    } else {
                        emailField.style.borderColor = '#ddd'; // Reset border if valid
                        removeFieldError(emailField); // Clear previous error message
                    }
                }
            } else {
                console.warn('Email field not found for validation.');
            }

            if (!isValid) {
                return; // Stop further processing if any validation failed
            }
            
            console.log('Form is valid. Proceeding with payment/order.');
            // 表单处理逻辑... (This comment represents the placeholder for actual submission)
        });
    }
    
    // 表单字段验证（实时验证，提高用户体验）
    if (purchaseForm) {
        // 添加必填字段提示
        const nameField = document.getElementById('name');
        const phoneField = document.getElementById('phone');
        const emailField = document.getElementById('email');
        const addressField = document.getElementById('address');
        
        // 为必填字段添加星号标记
        const requiredLabels = document.querySelectorAll('label[for="name"], label[for="phone"], label[for="email"], label[for="address"]');
        requiredLabels.forEach(label => {
            if (!label.innerHTML.includes('*')) {
                label.innerHTML += ' <span style="color: #e74c3c">*</span>';
            }
        });
        
        // 姓名验证
        if (nameField) {
            nameField.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#e74c3c';
                    // 添加错误提示
                    showFieldError(this, 'Name is required');
                } else {
                    this.style.borderColor = '#ddd';
                    removeFieldError(this);
                }
            });
        }
        
        // 电话号码验证
        if (phoneField) {
            phoneField.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#e74c3c';
                    showFieldError(this, 'Phone number is required');
                } else {
                    // 使用更宽松的电话号码验证，支持国际格式
                    const phoneRegex = /^\+?(\d{1,4}[\s\-\.\,]?)?(\(?\d{1,6}\)?)?([\s\-\.\,]?\d{1,5}){1,4}$/;
                    if (!phoneRegex.test(this.value.trim())) {
                        this.style.borderColor = '#e74c3c';
                        showFieldError(this, 'Invalid phone number');
                    } else {
                        this.style.borderColor = '#ddd';
                        removeFieldError(this);
                    }
                }
            });
        }
        
        // 邮箱验证
        if (emailField) {
            emailField.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#e74c3c';
                    showFieldError(this, 'Email is required');
                } else {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value.trim())) {
                        this.style.borderColor = '#e74c3c';
                        showFieldError(this, 'Invalid email address');
                    } else {
                        this.style.borderColor = '#ddd';
                        removeFieldError(this);
                    }
                }
            });
        }
        
        // 地址验证
        if (addressField) {
            addressField.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#e74c3c';
                    showFieldError(this, 'Shipping address is required');
                } else {
                    this.style.borderColor = '#ddd';
                    removeFieldError(this);
                }
            });
        }
        
    }
}

// 显示字段错误提示
function showFieldError(field, message) {
    // 移除已有的错误提示
    removeFieldError(field);
    
    // 创建错误提示元素
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // 插入到字段后面
    field.parentNode.appendChild(errorElement);
}

// 移除字段错误提示
function removeFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// 添加模态框样式
document.addEventListener('DOMContentLoaded', function() {
    // 添加模态框样式
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: none;
        }
        
        .modal.active {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .modal-content {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            position: relative;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        
        .success-icon {
            font-size: 60px;
            color: #2ecc71;
            margin-bottom: 20px;
        }
        
        .close-modal {
            margin-top: 20px;
        }
        
        .close-x {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }
        
        .close-x:hover {
            color: #333;
        }
    `;
    document.head.appendChild(styleElement);

            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .modal[style*="display: block"] {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 500px;
            width: 90%;
            position: relative;
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        }
        
        .modal[style*="display: block"] .modal-content {
            transform: translateY(0);
        }
        
        .success-icon {
            font-size: 60px;
            color: #2ecc71;
            margin-bottom: 20px;
        }
        
        .close-x {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }
        
        .close-x:hover {
            color: #333;
        }
    `;
    document.head.appendChild(styleElement);
});
    
    // 返回顶部按钮
    const backToTopBtn = document.createElement('div');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 监听滚动事件，显示/隐藏返回顶部按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // 创建图片文件夹占位符
    function createImagePlaceholders() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // 保存原始src
            const originalSrc = img.getAttribute('src');
            
            // 设置占位符
            img.classList.add('placeholder');
            
            // 创建一个新图像对象来预加载
            const newImg = new Image();
            newImg.onload = function() {
                // 图像加载完成后，移除占位符类并设置原始src
                img.classList.remove('placeholder');
                img.src = originalSrc;
            };
            
            // 设置一个延迟来模拟加载
            setTimeout(() => {
                newImg.src = originalSrc;
            }, 500);
        });
    }
    
    createImagePlaceholders();
    
    // 产品数量增减功能
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        // 创建增减按钮
        const quantityWrapper = document.createElement('div');
        quantityWrapper.className = 'quantity-wrapper';
        
        const decreaseBtn = document.createElement('button');
        decreaseBtn.type = 'button';
        decreaseBtn.className = 'quantity-btn decrease';
        decreaseBtn.innerHTML = '-';
        
        const increaseBtn = document.createElement('button');
        increaseBtn.type = 'button';
        increaseBtn.className = 'quantity-btn increase';
        increaseBtn.innerHTML = '+';
        
        // 插入按钮
        quantityInput.parentNode.insertBefore(decreaseBtn, quantityInput);
        quantityInput.parentNode.appendChild(increaseBtn);
        
        // 添加事件监听
        decreaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    }
    
    // 产品选择更新价格
    const productSelect = document.getElementById('product');
    if (productSelect) {
        productSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex].text;
            const priceMatch = selectedOption.match(/¥(\d+)/);
            
            if (priceMatch && priceMatch[1]) {
                const price = priceMatch[1];
                // 这里可以更新显示的价格或进行其他操作
                console.log('选择的产品价格: ¥' + price);
            }
        });
    }
});