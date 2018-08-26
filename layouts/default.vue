<template>
    <v-app>
        <div class="container">
            <nuxt/>
        </div>
    </v-app>
</template>

<style lang="less">
body {
    background: #C9C9C9 !important;
    font-family: 'Helvetica Neue',Helvetica,'Nimbus Sans L',Arial,'Liberation Sans','Hiragino Sans GB','Source Han Sans CN','Source Han Sans SC','Microsoft YaHei','Wenquanyi Micro Hei','WenQuanYi Zen Hei','ST Heiti',SimHei,'WenQuanYi Zen Hei Sharp',sans-serif !important;
}
.application--wrap {
    background: #C9C9C9 !important;
}
html::before {
    content: ' ';
    display: block;
    background-color: #4A4A4E;
    width: 100%;
    height: 25px;
    position: relative;
    z-index: 1;
}
.container {
    padding-top: 0px !important;
    max-width: 800px;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
}
</style>
