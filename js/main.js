// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 轮播图功能
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;
    
    // 初始化轮播图
    function initSlider() {
        if (slides.length === 0) return;
        
        // 设置第一个slide为激活状态
        slides[0].classList.add('active');
        dots[0].classList.add('active');
        
        // 启动自动轮播
        startSlideShow();
        
        // 添加事件监听器
        prevBtn?.addEventListener('click', prevSlide);
        nextBtn?.addEventListener('click', nextSlide);
        
        // 点击指示点切换轮播图
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const slideIndex = parseInt(this.getAttribute('data-slide'));
                goToSlide(slideIndex);
            });
        });
        
        // 鼠标悬停暂停轮播，移出继续
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopSlideShow);
            sliderContainer.addEventListener('mouseleave', startSlideShow);
        }
    }
    
    // 切换到指定的轮播图
    function goToSlide(index) {
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        
        // 移除当前激活的slide和dot
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        // 激活新的slide和dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // 更新当前slide索引
        currentSlide = index;
    }
    
    // 下一张轮播图
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // 上一张轮播图
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // 开始自动轮播
    function startSlideShow() {
        stopSlideShow(); // 确保没有多个轮播定时器
        slideInterval = setInterval(nextSlide, 5000); // 5秒切换一次
    }
    
    // 停止自动轮播
    function stopSlideShow() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }
    
    // 初始化轮播图
    initSlider();
    
    // 导航栏滚动效果
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // 移动端菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 关闭移动端菜单
                if (menuToggle && menuToggle.classList.contains('active')) {
                    menuToggle.click();
                }
            }
        });
    });
    
    // 滚动动画
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    const scaleElements = document.querySelectorAll('.scale-in');
    
    // Intersection Observer 配置
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // 创建 Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 监听淡入元素
    fadeElements.forEach(element => {
        observer.observe(element);
    });
    
    // 监听缩放元素
    scaleElements.forEach(element => {
        observer.observe(element);
    });
    
    // 数字动画效果
    const animateNumbers = () => {
        const numberElements = document.querySelectorAll('.animate-number');
        
        numberElements.forEach(element => {
            const targetNumber = parseInt(element.getAttribute('data-target'));
            const duration = 2000; // 动画持续时间（毫秒）
            const startTime = performance.now();
            
            const updateNumber = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const currentNumber = Math.floor(progress * targetNumber);
                
                element.textContent = currentNumber;
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    element.textContent = targetNumber;
                }
            };
            
            requestAnimationFrame(updateNumber);
        });
    };
    
    // 监听数字统计部分
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        statsObserver.observe(statsSection);
    }
    
    // 服务卡片悬停效果
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            serviceCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 作品集过滤功能
    const portfolioFilters = document.querySelectorAll('.portfolio-filter li');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (portfolioFilters.length > 0) {
        portfolioFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // 移除所有活动类
                portfolioFilters.forEach(f => f.classList.remove('active'));
                
                // 添加活动类到当前过滤器
                this.classList.add('active');
                
                // 获取过滤值
                const filterValue = this.getAttribute('data-filter');
                
                // 过滤项目
                portfolioItems.forEach(item => {
                    if (filterValue === 'all') {
                        item.style.display = 'block';
                    } else if (!item.classList.contains(filterValue)) {
                        item.style.display = 'none';
                    } else {
                        item.style.display = 'block';
                    }
                });
            });
        });
    }
    
    // 页面加载动画
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// FAQ 折叠效果
const faqItems = document.querySelectorAll('.faq-question');

if (faqItems.length > 0) {
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            const parent = this.parentElement;
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.toggle-icon i');
            
            // 切换当前FAQ项目
            parent.classList.toggle('active');
            
            // 更新图标和内容高度
            if (parent.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.classList.replace('fa-plus', 'fa-minus');
            } else {
                answer.style.maxHeight = '0';
                icon.classList.replace('fa-minus', 'fa-plus');
            }
            
            // 关闭其他FAQ项目
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherParent = otherItem.parentElement;
                    const otherAnswer = otherItem.nextElementSibling;
                    const otherIcon = otherItem.querySelector('.toggle-icon i');
                    
                    otherParent.classList.remove('active');
                    otherAnswer.style.maxHeight = '0';
                    
                    if (otherIcon.classList.contains('fa-minus')) {
                        otherIcon.classList.replace('fa-minus', 'fa-plus');
                    }
                }
            });
        });
    });
}

// 表单验证
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // 清除之前的错误消息
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // 验证姓名
        if (!nameInput.value.trim()) {
            showError(nameInput, '请输入您的姓名');
            isValid = false;
        }
        
        // 验证邮箱
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, '请输入有效的邮箱地址');
            isValid = false;
        }
        
        // 验证消息
        if (!messageInput.value.trim()) {
            showError(messageInput, '请输入您的留言');
            isValid = false;
        }
        
        // 如果表单验证通过，可以在这里提交表单
        if (isValid) {
            // 模拟表单提交
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
            
            // 这里可以使用实际的表单提交代码或AJAX请求
            setTimeout(() => {
                contactForm.reset();
                showSuccessMessage(contactForm, '谢谢您的留言，我们会尽快回复！');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }, 1500);
        }
    });
}

// 视差滚动效果
window.addEventListener('scroll', function() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const scrolled = window.pageYOffset;
        const rate = element.getAttribute('data-parallax-rate') || 0.3;
        const initialPosition = element.getAttribute('data-initial-position') || 0;
        
        element.style.transform = `translate3d(0, ${(scrolled * rate) + parseInt(initialPosition)}px, 0)`;
    });
});

// 辅助函数 - 显示错误消息
function showError(inputElement, message) {
    const formGroup = inputElement.parentElement;
    const errorElement = document.createElement('div');
    
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    formGroup.appendChild(errorElement);
    inputElement.classList.add('error');
    
    inputElement.addEventListener('input', function() {
        errorElement.remove();
        inputElement.classList.remove('error');
    }, { once: true });
}

// 辅助函数 - 显示成功消息
function showSuccessMessage(formElement, message) {
    const successElement = document.createElement('div');
    
    successElement.className = 'success-message';
    successElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    formElement.appendChild(successElement);
    
    setTimeout(() => {
        successElement.style.opacity = '0';
        setTimeout(() => {
            successElement.remove();
        }, 300);
    }, 5000);
}

// 辅助函数 - 验证邮箱
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
} 