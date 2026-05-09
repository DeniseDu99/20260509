/**
 * Admin Dashboard JavaScript
 */

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Settings form functionality
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        // Tab switching functionality
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current button and corresponding content
                this.classList.add('active');
                const tabId = this.dataset.tab;
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Form submission
        settingsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Collect form data
            const formData = new FormData(settingsForm);
            const settingsData = {};
            
            for (const [key, value] of formData.entries()) {
                settingsData[key] = value;
            }
            
            // Handle file uploads separately
            const logoFile = document.getElementById('siteLogo').files[0];
            if (logoFile) {
                // In a real app, you would upload this file to a server
                settingsData.logoFileName = logoFile.name;
            }
            
            const faviconFile = document.getElementById('favicon').files[0];
            if (faviconFile) {
                // In a real app, you would upload this file to a server
                settingsData.faviconFileName = faviconFile.name;
            }
            
            console.log('Settings data to be saved:', settingsData);
            
            // 在实际应用中，你会将这些数据发送到服务器
            // 对于这个演示，我们将保存到localStorage
            localStorage.setItem('websiteSettings', JSON.stringify(settingsData));
            
            // 特别处理联系方式数据
            const contactData = {
                email: document.getElementById('contactEmail').value,
                phone: document.getElementById('contactPhone').value,
                address: document.getElementById('contactAddress').value,
                facebook: document.querySelector('input[name="facebookUrl"]')?.value,
                twitter: document.querySelector('input[name="twitterUrl"]')?.value,
                instagram: document.querySelector('input[name="instagramUrl"]')?.value,
                linkedin: document.querySelector('input[name="linkedinUrl"]')?.value
            };
            
            localStorage.setItem('contactSettings', JSON.stringify(contactData));
            
            // 创建或更新一个标志，表示设置已更新
            localStorage.setItem('settingsUpdated', 'true');
            localStorage.setItem('settingsLastUpdated', new Date().toISOString());
            
            // 将设置应用到当前页面
            applySettings(settingsData, contactData);
            
            // 尝试调用前端的applyAdminSettings函数
            if (typeof window.applyAdminSettings === 'function') {
                window.applyAdminSettings();
            } else if (typeof applyAdminSettings === 'function') {
                applyAdminSettings();
            }
            
            // 显示成功消息
            alert('设置已成功保存！已应用到当前页面，网站前端将在下次加载时自动应用这些设置。');
        });
        
        // 定义应用设置的函数
        function applySettings(settings, contactSettings) {
            // 应用基本设置
            if (settings.siteName) {
                document.title = settings.siteName + ' - 管理后台';
                const logoElements = document.querySelectorAll('.logo h1, .footer-logo h2');
                logoElements.forEach(el => {
                    if (el) el.textContent = settings.siteName;
                });
            }
            
            // 应用颜色设置
            if (settings.primaryColor || settings.secondaryColor) {
                let styleElement = document.getElementById('dynamic-styles');
                if (!styleElement) {
                    styleElement = document.createElement('style');
                    styleElement.id = 'dynamic-styles';
                    document.head.appendChild(styleElement);
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
                }
                
                if (settings.secondaryColor) {
                    cssRules += `
                        .btn-secondary {
                            background-color: ${settings.secondaryColor};
                        }
                    `;
                }
                
                styleElement.textContent = cssRules;
            }
            
            // 应用字体设置
            if (settings.fontFamily) {
                document.body.style.fontFamily = settings.fontFamily;
            }
            
            // 应用联系方式设置
            if (contactSettings) {
                const contactElements = document.querySelectorAll('.contact-info .info-item');
                contactElements.forEach(item => {
                    const icon = item.querySelector('i');
                    if (!icon) return;
                    
                    if (icon.classList.contains('fa-envelope') && contactSettings.email) {
                        const emailElement = item.querySelector('p');
                        if (emailElement) emailElement.textContent = contactSettings.email;
                    } else if (icon.classList.contains('fa-phone') && contactSettings.phone) {
                        const phoneElement = item.querySelector('p');
                        if (phoneElement) phoneElement.textContent = contactSettings.phone;
                    } else if (icon.classList.contains('fa-map-marker-alt') && contactSettings.address) {
                        const addressElement = item.querySelector('p');
                        if (addressElement) addressElement.textContent = contactSettings.address;
                    }
                });
                
                // 更新社交媒体链接
                const socialLinks = document.querySelectorAll('.social-links a');
                if (socialLinks.length > 0 && contactSettings.facebook) {
                    socialLinks[0].href = contactSettings.facebook;
                }
                if (socialLinks.length > 1 && contactSettings.twitter) {
                    socialLinks[1].href = contactSettings.twitter;
                }
                if (socialLinks.length > 2 && contactSettings.instagram) {
                    socialLinks[2].href = contactSettings.instagram;
                }
                if (socialLinks.length > 3 && contactSettings.linkedin) {
                    socialLinks[3].href = contactSettings.linkedin;
                }
            }
        }
        });
        
        // Load saved settings if available
        const savedSettings = localStorage.getItem('websiteSettings');
        const savedContactSettings = localStorage.getItem('contactSettings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Populate form fields with saved values
            for (const key in settings) {
                const input = settingsForm.querySelector(`[name="${key}"]`);
                if (input && input.type !== 'file') {
                    input.value = settings[key];
                }
            }
        }
        
        if (savedContactSettings) {
            const contactSettings = JSON.parse(savedContactSettings);
            // 恢复联系方式字段值
            if (contactSettings.email) document.getElementById('contactEmail').value = contactSettings.email;
            if (contactSettings.phone) document.getElementById('contactPhone').value = contactSettings.phone;
            if (contactSettings.address) document.getElementById('contactAddress').value = contactSettings.address;
            if (contactSettings.facebook && document.querySelector('input[name="facebookUrl"]')) document.querySelector('input[name="facebookUrl"]').value = contactSettings.facebook;
            if (contactSettings.twitter && document.querySelector('input[name="twitterUrl"]')) document.querySelector('input[name="twitterUrl"]').value = contactSettings.twitter;
            if (contactSettings.instagram && document.querySelector('input[name="instagramUrl"]')) document.querySelector('input[name="instagramUrl"]').value = contactSettings.instagram;
            if (contactSettings.linkedin && document.querySelector('input[name="linkedinUrl"]')) document.querySelector('input[name="linkedinUrl"]').value = contactSettings.linkedin;
        }
        
        // Reset button functionality
        const resetButton = settingsForm.querySelector('.btn-outline');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                if (confirm('确定要恢复默认设置吗？所有更改将丢失。')) {
                    settingsForm.reset();
                    localStorage.removeItem('websiteSettings');
            localStorage.removeItem('contactSettings');
                    alert('已恢复默认设置！');
                }
            });
        }
    }
    
    // Delete post confirmation
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to delete this post?')) {
                // In a real application, you would send a request to delete the post
                // For this demo, we'll just show an alert
                alert('Post deleted successfully!');
                // You could remove the post from the DOM here
                const postItem = this.closest('.post-item');
                if (postItem) {
                    postItem.remove();
                }
            }
        });
    });
    
    // Blog form validation (if on the add blog page)
    const blogForm = document.getElementById('blogForm');
    if (blogForm) {
        blogForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Basic validation
            const title = document.getElementById('blogTitle').value.trim();
            const category = document.getElementById('blogCategory').value;
            const content = document.getElementById('blogContent').value.trim();
            
            if (!title) {
                alert('Please enter a blog title');
                return;
            }
            
            if (!category) {
                alert('Please select a category');
                return;
            }
            
            if (!content) {
                alert('Please enter blog content');
                return;
            }
            
            // 收集表单数据
            const formData = new FormData(blogForm);
            const blogData = {};
            
            for (const [key, value] of formData.entries()) {
                blogData[key] = value;
            }
            
            // 添加发布日期
            blogData.publishDate = new Date().toISOString();
            
            // 处理图片文件
            const imageFile = document.getElementById('blogImage').files[0];
            if (imageFile) {
                // 在实际应用中，你会上传这个文件到服务器
                blogData.imageName = imageFile.name;
            }
            
            console.log('Blog data to be submitted:', blogData);
            
            // 保存博客数据到localStorage
            // 获取现有博客数据
            let savedBlogs = localStorage.getItem('blogPosts');
            let blogPosts = savedBlogs ? JSON.parse(savedBlogs) : [];
            
            // 添加新博客
            blogPosts.push(blogData);
            
            // 保存回localStorage
            localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
            
            // 显示成功消息并重定向
            alert('博客文章发布成功！');
            window.location.href = 'index.html';
        });
    }
    
    // Rich text editor initialization (simplified version)
    const blogContentTextarea = document.getElementById('blogContent');
    if (blogContentTextarea) {
        // Add basic formatting buttons
        const editorToolbar = document.createElement('div');
        editorToolbar.className = 'editor-toolbar';
        editorToolbar.innerHTML = `
            <button type="button" data-command="bold" title="Bold"><i class="fas fa-bold"></i></button>
            <button type="button" data-command="italic" title="Italic"><i class="fas fa-italic"></i></button>
            <button type="button" data-command="underline" title="Underline"><i class="fas fa-underline"></i></button>
            <button type="button" data-command="insertHeading" title="Heading"><i class="fas fa-heading"></i></button>
            <button type="button" data-command="insertParagraph" title="Paragraph"><i class="fas fa-paragraph"></i></button>
            <button type="button" data-command="insertList" title="List"><i class="fas fa-list"></i></button>
        `;
        
        blogContentTextarea.parentNode.insertBefore(editorToolbar, blogContentTextarea);
        
        // Add event listeners to buttons
        const buttons = editorToolbar.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const command = this.dataset.command;
                
                // Simple text formatting (in a real app, you would use a proper rich text editor)
                const textarea = document.getElementById('blogContent');
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = textarea.value.substring(start, end);
                let replacement = '';
                
                switch(command) {
                    case 'bold':
                        replacement = `<strong>${selectedText}</strong>`;
                        break;
                    case 'italic':
                        replacement = `<em>${selectedText}</em>`;
                        break;
                    case 'underline':
                        replacement = `<u>${selectedText}</u>`;
                        break;
                    case 'insertHeading':
                        replacement = `<h2>${selectedText}</h2>`;
                        break;
                    case 'insertParagraph':
                        replacement = `<p>${selectedText}</p>`;
                        break;
                    case 'insertList':
                        replacement = `<ul>\n  <li>${selectedText}</li>\n  <li>List item</li>\n</ul>`;
                        break;
                }
                
                if (replacement) {
                    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
                }
            });
        });
        
        // Add some basic styles to the toolbar
        const style = document.createElement('style');
        style.textContent = `
            .editor-toolbar {
                display: flex;
                gap: 5px;
                margin-bottom: 10px;
                background: #f5f5f5;
                padding: 8px;
                border-radius: 5px;
            }
            .editor-toolbar button {
                background: white;
                border: 1px solid #ddd;
                border-radius: 3px;
                padding: 5px 10px;
                cursor: pointer;
            }
            .editor-toolbar button:hover {
                background: #f0f0f0;
            }
        `;
        document.head.appendChild(style);
    }
});