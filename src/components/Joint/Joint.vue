<template>
  <div class="topology">
    <div class="tools">
      <div v-for="(item, index) in iTools" :key="index">
        <div class="title">{{ item.group }}</div>
        <div class="buttons">
          <a
            v-for="(btn, i) in item.children"
            :key="index + '-' + i"
            :title="btn.name"
            draggable="true"
            @dragstart="onDrag(btn)"
          >
            <i :class="`iconfont ${btn.icon}`"></i>
          </a>
        </div>
      </div>
    </div>
    <div
      id="topology-canvas"
      class="full"
      :class="iTopologyData.grid? 'canvas-container': ''"
    />
    <div class="props">
      <div v-if="iProps.node && !iTopologyData.locked">
        <div class="title">样式</div>
        <el-row :gutter="16" class="row-layout">
          <el-col :span="24">
            <div class="bable">线条样式</div>
            <div class="bable-content">
              <el-select v-model="iProps.node.dash" style="width:100%;" @change="onUpdateProps(iProps.node)">
                <el-option :value="0">直线</el-option>
                <el-option :value="1">虚线</el-option>
                <el-option :value="2">大虚线</el-option>
                <el-option :value="3">断点虚线</el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">线条颜色</div>
            <div class="bable-content">
              <el-input v-model="iProps.node.strokeStyle" placeholder="线条颜色" @change="onUpdateProps(iProps.node)">
                <el-color-picker slot="prefix" v-model="iProps.node.strokeStyle" defaultColor="#222"
                                 class="color-picker" @change="onUpdateProps(iProps.node)"/>
              </el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">线条宽度(px)</div>
            <div class="bable-content">
              <el-input-number v-model="iProps.node.lineWidth" :min="1" style="width:100%;"
                               @change="onUpdateProps(iProps.node)"/>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">背景颜色</div>
            <div class="bable-content">
              <el-input :value="iProps.node.fillStyle || '#fff'" placeholder="背景颜色"
                        @change="onUpdateProps(iProps.node)">
                <el-color-picker slot="prefix" v-model="iProps.node.fillStyle" defaultColor="#fff" class="color-picker"
                                 @change="onUpdateProps(iProps.node)"/>
              </el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">透明度(0-1)</div>
            <div class="bable-content">
              <el-input-number v-model="iProps.node.globalAlpha" :min="0" :max="1" :step="0.1" default-value="1"
                               style="width:100%;" @change="onUpdateProps(iProps.node)"/>
            </div>
          </el-col>
        </el-row>
        <div class="title">文字</div>
        <el-row :gutter="16" class="row-layout">
          <el-col :span="12">
            <div class="bable">大小</div>
            <div class="bable-content">
              <el-input-number v-model="iProps.node.font.fontSize" :min="12" :precision="0" style="width:100%;"
                               @change="onUpdateProps(iProps.node)"/>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">加粗</div>
            <div class="bable-content">
              <el-select v-model="iProps.node.font.fontWeight" style="width:100%;" @change="onUpdateProps(iProps.node)">
                <el-option :value="'normal'">正常</el-option>
                <el-option :value="'bold'">加粗</el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">颜色</div>
            <div class="bable-content">
              <el-input v-model="iProps.node.font.color" placeholder="颜色" @change="onUpdateProps(iProps.node)">
                <el-color-picker slot="prefix" v-model="iProps.node.font.color" defaultColor="#222" class="color-picker"
                                 @change="onUpdateProps(iProps.node)"/>
              </el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">倾斜</div>
            <div class="bable-content">
              <el-select v-model="iProps.node.font.fontStyle" style="width:100%;" @change="onUpdateProps(iProps.node)">
                <el-option :value="'normal'">正常</el-option>
                <el-option :value="'italic'">倾斜</el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">水平对齐</div>
            <div class="bable-content">
              <el-select v-model="iProps.node.font.textAlign" style="width:100%;" @change="onUpdateProps(iProps.node)">
                <el-option :value="'left'">左对齐</el-option>
                <el-option :value="'center'">居中</el-option>
                <el-option :value="'right'">右对齐</el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">垂直对齐</div>
            <div class="bable-content">
              <el-select v-model="iProps.node.font.textBaseline" style="width:100%;"
                         @change="onUpdateProps(iProps.node)">
                <el-option :value="'top'">顶部对齐</el-option>
                <el-option :value="'middle'">居中</el-option>
                <el-option :value="'bottom'">底部对齐</el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="bable">内容</div>
            <div class="bable-content">
              <el-input v-model="iProps.node.text" placeholder="文字内容" :auto-size="{ minRows: 4, maxRows: 10 }"
                        @change="onUpdateProps(iProps.node)"/>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="iProps.line && !iTopologyData.locked">
        <div class="title">样式</div>
        <el-row :gutter="16" class="row-layout">
          <el-col :span="12">
            <div class="bable">线条样式</div>
            <div class="bable-content">
              <el-select v-model="iProps.line.dash" style="width:100%;" @change="onUpdateProps(iProps.line)">
                <el-option :value="0">直线</el-option>
                <el-option :value="1">虚线</el-option>
                <el-option :value="2">大虚线</el-option>
                <el-option :value="3">断点虚线</el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">连线类型</div>
            <div class="bable-content">
              <el-select v-model="iProps.line.name" style="width:100%;" @change="onUpdateProps(iProps.line)">
                <el-option :value="'curve'">贝塞尔曲线</el-option>
                <el-option :value="'polyline'">折线</el-option>
                <el-option :value="'line'">直线</el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">线条颜色</div>
            <div class="bable-content">
              <el-input v-model="iProps.line.strokeStyle" placeholder="颜色" @change="onUpdateProps(iProps.line)">
                <el-color-picker slot="prefix" v-model="iProps.line.strokeStyle" defaultColor="#222"
                                 class="color-picker" @change="onUpdateProps(iProps.line)"/>
              </el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">线条宽度(px)</div>
            <div class="bable-content">
              <el-input-number v-model="iProps.line.lineWidth" :min="1" :precision="0" style="width:100%;"
                               @change="onUpdateProps(iProps.line)"/>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">连线边框</div>
            <div class="bable-content">
              <el-input v-model="iProps.line.borderColor" placeholder="边框" @change="onUpdateProps(iProps.line)">
                <el-color-picker slot="prefix" v-model="iProps.line.borderColor" defaultColor="#000000"
                                 class="color-picker" @change="onUpdateProps(iProps.line)"/>
              </el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">边框宽度(px)</div>
            <div class="bable-content">
              <el-input-number v-model="iProps.line.borderWidth" :min="0" :precision="0" style="width:100%;"
                               @change="onUpdateProps(iProps.line)"/>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">透明度(0-1)</div>
            <div class="bable-content">
              <el-input-number v-model="iProps.line.globalAlpha" :min="0" :max="1" :step="0.1" default-value="1"
                               style="width:100%;" @change="onUpdateProps(iProps.line)"/>
            </div>
          </el-col>
        </el-row>
        <div class="title">箭头</div>
        <el-row :gutter="16" class="row-layout">
          <el-col :span="12">
            <div class="bable">起点箭头</div>
            <div class="bable-content">
              <el-select v-model="iProps.line.fromArrow" style="width:100%;" @change="onUpdateProps(iProps.line)">
                <el-option
                    v-for="(item, index) in arrowTypes" :key="index"
                    :value="item"
                >
                  <i :class="`iconfont icon-from-${item}`" style="font-size:30px;color:#000;"></i>
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">终点箭头</div>
            <div class="bable-content">
              <el-select v-model="iProps.line.toArrow" style="width:100%;" @change="onUpdateProps(iProps.line)">
                <el-option
                    v-for="(item, index) in arrowTypes" :key="index"
                    :value="item"
                >
                  <i :class="`iconfont icon-to-${item}`" style="font-size:30px;color:#000;"></i>
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">起点箭头颜色</div>
            <div class="bable-content">
              <el-input :value="iProps.line.fromArrowColor || '#222'" placeholder="颜色"
                        @change="onUpdateProps(iProps.line)">
                <el-color-picker slot="prefix" v-model="iProps.line.fromArrowColor" defaultColor="#222"
                                 class="color-picker" @change="onUpdateProps(iProps.line)"/>
              </el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">起点箭头大小(px)</div>
            <div class="bable-content">
              <el-input-number v-model="iProps.line.fromArrowSize" :min="5" :precision="0" style="width:100%;"
                               @change="onUpdateProps(iProps.line)"/>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">终点箭头颜色</div>
            <div class="bable-content">
              <el-input :value="iProps.line.toArrowColor || '#222'" placeholder="颜色"
                        @change="onUpdateProps(iProps.line)">
                <el-color-picker slot="prefix" v-model="iProps.line.toArrowColor" defaultColor="#222"
                                 class="color-picker" @change="onUpdateProps(iProps.line)"/>
              </el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">终点箭头大小(px)</div>
            <div class="bable-content">
              <el-input-number v-model="iProps.line.toArrowSize" :min="5" :precision="0" style="width:100%;"
                               @change="onUpdateProps(iProps.line)"/>
            </div>
          </el-col>
        </el-row>
        <div class="title">文字</div>
        <el-row :gutter="16" class="row-layout">
          <el-col :span="12">
            <div class="bable">大小</div>
            <div class="bable-content">
              <el-input-number v-model="iProps.line.font.fontSize" :min="12" :precision="0" style="width:100%;"
                               @change="onUpdateProps(iProps.line)"/>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">加粗</div>
            <div class="bable-content">
              <el-select v-model="iProps.line.font.fontWeight" style="width:100%;" @change="onUpdateProps(iProps.line)">
                <el-option :value="'normal'">正常</el-option>
                <el-option :value="'bold'">加粗</el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">颜色</div>
            <div class="bable-content">
              <el-input :value="iProps.line.font.color || '#222'" placeholder="颜色" @change="onUpdateProps(iProps.line)">
                <el-color-picker slot="prefix" v-model="iProps.line.font.color" defaultColor="#222" class="color-picker"
                                 @change="onUpdateProps(iProps.line)"/>
              </el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">倾斜</div>
            <div class="bable-content">
              <el-select v-model="iProps.line.font.fontStyle" style="width:100%;" @change="onUpdateProps(iProps.line)">
                <el-option :value="'normal'">正常</el-option>
                <el-option :value="'italic'">倾斜</el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">水平对齐</div>
            <div class="bable-content">
              <el-select v-model="iProps.line.font.textAlign" style="width:100%;" @change="onUpdateProps(iProps.line)">
                <el-option :value="'left'">左对齐</el-option>
                <el-option :value="'center'">居中</el-option>
                <el-option :value="'right'">右对齐</el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="bable">垂直对齐</div>
            <div class="bable-content">
              <el-select v-model="iProps.line.font.textBaseline" style="width:100%;"
                         @change="onUpdateProps(iProps.line)">
                <el-option :value="'top'">顶部对齐</el-option>
                <el-option :value="'middle'">居中</el-option>
                <el-option :value="'bottom'">底部对齐</el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="bable">内容</div>
            <div class="bable-content">
              <el-input v-model="iProps.line.text" placeholder="文字内容" :auto-size="{ minRows: 4, maxRows: 10 }"
                        @change="onUpdateProps(iProps.line)"/>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="!iProps.node && !iProps.line && !iProps.multi">
        <div class="title">图文设置</div>
        <div class="settings">
          <div class="item">
            <span class="label">背景网格：</span>
            <el-switch v-model="iTopologyData.grid" size="small" @change="onSwitchChange"/>
          </div>
          <div class="item">
            <span class="label">下载图文：</span>
            <a href="javascript:;" @click="e => handleMenuClick(e)">下载为png</a>
          </div>
<!--          <div class="item">
            <span class="label">视图大小：</span>{{ Math.floor(canvasData.scale * 100) }}%
          </div>-->
<!--          <div class="item">
            <span class="label">画布锁定：</span>
            <el-radio-group v-model="iTopologyData.locked" @change="onRootChange">
              <el-radio :value="true">是</el-radio>
              <el-radio :value="false">否</el-radio>
            </el-radio-group>
          </div>-->
          <div class="item select">
            <span class="label">默认连线类型：</span>
            <el-select v-model="canvasData.lineName" default-value="curve" size="small" @change="handleLinenameChange">
              <el-option
                  v-for="(item, index) in lineNames" :key="index"
                  :value="item"
              >
                <i :class="`iconfont icon-${item}`" style="font-size:30px;"></i>
              </el-option>
            </el-select>
          </div>
          <div class="item select">
            <span class="label">默认起点箭头：</span>
            <el-select v-model="canvasData.fromArrowType" default-value="''" size="small"
                       @change="handlefromArrowChange">
              <el-option
                  v-for="(item, index) in arrowTypes" :key="index"
                  :value="item"
              >
                <i :class="`iconfont icon-from-${item}`" style="font-size:30px;"></i>
              </el-option>
            </el-select>
          </div>
          <div class="item select">
            <span class="label">默认终点箭头：</span>
            <el-select v-model="canvasData.toArrowType" default-value="triangleSolid" size="small"
                       @change="handletoArrowChange">
              <el-option
                  v-for="(item, index) in arrowTypes" :key="index"
                  :value="item"
              >
                <i :class="`iconfont icon-to-${item}`" style="font-size:30px;"></i>
              </el-option>
            </el-select>
          </div>
<!--          <div class="item">
            <span class="label">打印：</span>
            <a href="javascript:;" @click="e => handleConsoleClick(e)">点击打印JSON数据</a>
          </div>
          <div class="item">
            <span class="label">测试：</span>
            <a href="javascript:;" @click="e => handlePreviewClick(e)">点击获取流程图</a>
          </div>-->
        </div>
        <div class="bottom">
          <div class="title">小提示</div>
          <ul class="group">
            <li>方向键：控制节点移动5个像素</li>
            <li>Ctrl + 方向键：控制节点移动1个像素</li>
            <li>Ctrl + 鼠标移动：移动整个画布</li>
            <li>Ctrl + 鼠标滚轮：缩放</li>
            <li>添加或选中节点，右侧属性支持上传各种图片哦</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, onMounted, ref} from 'vue';
import {Topology} from '@topology/core';
import {register as registerFlow} from '@topology/flow-diagram';
const Tools = [
  {
    group: '基本形状',
    children: [
      {
        name: 'rectangle',
        icon: 'icon-rect',
        data: {
          text: '正方形',
          rect: {
            width: 100,
            height: 100
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          name: 'rectangle'
        }
      },
      {
        name: 'rectangle',
        icon: 'icon-rectangle',
        data: {
          text: '圆角矩形',
          rect: {
            width: 200,
            height: 50
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 0.1,
          name: 'rectangle'
        }
      },
      {
        name: 'circle',
        icon: 'icon-circle',
        data: {
          text: '圆',
          rect: {
            width: 100,
            height: 100
          },
          name: 'circle',
          textMaxLine: 1
        }
      },
      {
        name: 'triangle',
        icon: 'icon-triangle',
        data: {
          text: '三角形',
          rect: {
            width: 100,
            height: 100
          },
          name: 'triangle'
        }
      },
      {
        name: 'diamond',
        icon: 'icon-diamond',
        data: {
          text: '菱形',
          rect: {
            width: 100,
            height: 100
          },
          name: 'diamond'
        }
      },
      {
        name: 'pentagon',
        icon: 'icon-pentagon',
        data: {
          text: '五边形',
          rect: {
            width: 100,
            height: 100
          },
          name: 'pentagon'
        }
      },
      {
        name: 'hexagon',
        icon: 'icon-hexagon',
        data: {
          text: '六边形',
          rect: {
            width: 100,
            height: 100
          },
          paddingTop: 10,
          paddingBottom: 10,
          name: 'hexagon'
        }
      },
      {
        name: 'pentagram',
        icon: 'icon-pentagram',
        data: {
          text: '五角星',
          rect: {
            width: 100,
            height: 100
          },
          name: 'pentagram'
        }
      },
      {
        name: 'leftArrow',
        icon: 'icon-arrow-left',
        data: {
          text: '左箭头',
          rect: {
            width: 200,
            height: 100
          },
          name: 'leftArrow'
        }
      },
      {
        name: 'rightArrow',
        icon: 'icon-arrow-right',
        data: {
          text: '右箭头',
          rect: {
            width: 200,
            height: 100
          },
          name: 'rightArrow'
        }
      },
      {
        name: 'twowayArrow',
        icon: 'icon-twoway-arrow',
        data: {
          text: '双向箭头',
          rect: {
            width: 200,
            height: 100
          },
          name: 'twowayArrow'
        }
      },
      {
        name: 'line',
        icon: 'icon-line',
        data: {
          text: '直线',
          rect: {
            width: 100,
            height: 100
          },
          name: 'line'
        }
      },
      {
        name: 'text',
        icon: 'icon-text',
        data: {
          text: '文本 / Text',
          rect: {
            width: 160,
            height: 30
          },
          name: 'text'
        }
      }
    ]
  },
  {
    group: '流程图',
    children: [
      {
        name: '开始/结束',
        icon: 'icon-flow-start',
        data: {
          text: '开始',
          rect: {
            width: 120,
            height: 40
          },
          borderRadius: 0.5,
          name: 'rectangle'
        }
      },
      {
        name: '流程',
        icon: 'icon-rectangle',
        data: {
          text: '流程',
          rect: {
            width: 120,
            height: 40
          },
          name: 'rectangle'
        }
      },
      {
        name: '判定',
        icon: 'icon-diamond',
        data: {
          text: '判定',
          rect: {
            width: 120,
            height: 60
          },
          name: 'diamond'
        }
      },
      {
        name: '数据',
        icon: 'icon-flow-data',
        data: {
          text: '数据',
          rect: {
            width: 120,
            height: 50
          },
          name: 'flowData'
        }
      },
      {
        name: '准备',
        icon: 'icon-flow-ready',
        data: {
          text: '准备',
          rect: {
            width: 120,
            height: 50
          },
          name: 'hexagon'
        }
      },
      {
        name: '子流程',
        icon: 'icon-flow-subprocess',
        data: {
          text: '子流程',
          rect: {
            width: 120,
            height: 50
          },
          name: 'flowSubprocess'
        }
      },
      {
        name: '数据库',
        icon: 'icon-db',
        data: {
          text: '数据库',
          rect: {
            width: 80,
            height: 120
          },
          name: 'flowDb'
        }
      },
      {
        name: '文档',
        icon: 'icon-flow-document',
        data: {
          text: '文档',
          rect: {
            width: 120,
            height: 100
          },
          name: 'flowDocument'
        }
      },
      {
        name: '内部存储',
        icon: 'icon-internal-storage',
        data: {
          text: '内部存储',
          rect: {
            width: 120,
            height: 80
          },
          name: 'flowInternalStorage'
        }
      },
      {
        name: '外部存储',
        icon: 'icon-extern-storage',
        data: {
          text: '外部存储',
          rect: {
            width: 120,
            height: 80
          },
          name: 'flowExternStorage'
        }
      },
      {
        name: '队列',
        icon: 'icon-flow-queue',
        data: {
          text: '队列',
          rect: {
            width: 100,
            height: 100
          },
          name: 'flowQueue'
        }
      },
      {
        name: '手动输入',
        icon: 'icon-flow-manually',
        data: {
          text: '手动输入',
          rect: {
            width: 120,
            height: 80
          },
          name: 'flowManually'
        }
      },
      {
        name: '展示',
        icon: 'icon-flow-display',
        data: {
          text: '展示',
          rect: {
            width: 120,
            height: 80
          },
          name: 'flowDisplay'
        }
      },
      {
        name: '并行模式',
        icon: 'icon-flow-parallel',
        data: {
          text: '并行模式',
          rect: {
            width: 120,
            height: 50
          },
          name: 'flowParallel'
        }
      },
      {
        name: '注释',
        icon: 'icon-flow-comment',
        data: {
          text: '注释',
          rect: {
            width: 100,
            height: 100
          },
          name: 'flowComment'
        }
      }
    ]
  }
];

const lineNames = ['curve', 'polyline', 'line'];
const arrowTypes = ['', 'triangleSolid', 'triangle', 'diamondSolid', 'diamond', 'circleSolid', 'circle', 'line', 'lineUp', 'lineDown'];

export default defineComponent({
  name: 'Joint',
  props: {
    initData: Object,
    action: Function
  },
  setup(props, ctx) {
    const iProps = ref({
      node: null, // 节点
      line: null, // 连线
      nodes: null,
      multi: false, // 多个对象
      expand: false,
      locked: false
    });
    const contextmenu = ref({
      left: null,
      top: null,
      bottom: null
    });
    const canvasData = ref({});
    const iTopologyData= ref({
      grid: false, // 背景网格
      locked: false // 画布锁定
    });
    const canvasOptions = {};
    let canvas;
    const init = () => {
      canvasOptions.on = onMessage;
      canvas = new Topology('topology-canvas', canvasOptions);
      canvas.render();
    };
    const onDrag = (node) => {
      event.dataTransfer.setData('Topology', JSON.stringify(node.data));
    };
    const onContextMenu = () => {
      //event.preventDefault()
      //event.stopPropagation()
      if (event.clientY + 360 < document.body.clientHeight) {
        contextmenu.value = {
          left: event.clientX + 'px',
          top: event.clientY + 'px'
        }
      } else {
        contextmenu.value = {
          left: event.clientX + 'px',
          bottom: document.body.clientHeight - event.clientY + 'px'
        }
      }
    };
    const onMessage = (event, data) => {
      switch (event) {
        case 'node':
        case 'addNode':
          iProps.value = {
            node: data,
            line: null,
            multi: false,
            expand: iProps.value.expand,
            nodes: null,
            locked: iTopologyData.value.locked
          }
          break
        case 'line':
        case 'addLine':
          data.fromArrowColor = data.fromArrowColor ? data.fromArrowColor : '#222'
          data.toArrowColor = data.toArrowColor ? data.toArrowColor : '#222'
          iProps.value = {
            node: null,
            line: data,
            multi: false,
            nodes: null,
            locked: iTopologyData.value.locked
          }
          break
        case 'multi':
          iProps.value = {
            node: null,
            line: null,
            multi: true,
            nodes: data.length > 1 ? data : null,
            locked: getLocked({nodes: data})
          }
          break
        case 'space':
          iProps.value = {
            node: null,
            line: null,
            multi: false,
            nodes: null,
            locked: iTopologyData.value.locked
          }
          break
        case 'moveOut':
          break
        case 'moveNodes':
        case 'resizeNodes':
          if (data.length > 1) {
            iProps.value = {
              node: null,
              line: null,
              multi: true,
              nodes: data,
              locked: getLocked({nodes: data})
            }
          } else {
            iProps.value = {
              node: data[0],
              line: null,
              multi: false,
              nodes: null,
              locked: iTopologyData.value.locked
            }
          }
          break
        case 'resize':
        case 'scale':
        case 'locked':
          if (canvas && canvas.data) {
            canvasData.value = {
              scale: canvas.data.scale || 1, // 当前图文缩放比例： 0 - 1
              lineName: canvas.data.lineName, // 当前图文默认连线类型
              fromArrowType: canvas.data.fromArrowType, // 默认连线起点箭头
              toArrowType: canvas.data.toArrowType, // 连线终点默认箭头
              fromArrowlockedType: canvas.data.locked // 0-未锁定，可任意编辑，1-只读模式，允许选中，2-禁止鼠标交互，无法做任何操作。纯静态画面模式
            }
          }
          break
      }
    };
    const getLocked = (data) => {
      let locked = true
      if (data.nodes && data.nodes.length) {
        for (const item of data.nodes) {
          if (!item.locked) {
            locked = false
            break
          }
        }
      }
      if (locked && data.lines) {
        for (const item of data.lines) {
          if (!item.locked) {
            locked = false
            break
          }
        }
      }
      return locked
    };
    const onSwitchChange = (value) => {
      iTopologyData.value.grid = value
    };
    const handleMenuClick = (e) => {
      e.preventDefault()
      canvas.saveAsImage(`${Date.parse(new Date())}.png`)
    };
    const handleConsoleClick = (e) => {
      e.preventDefault()
      console.log(JSON.stringify(canvas.data), '打印canvas.data数据')
    };
    const handlePreviewClick = (e) => {
      e.preventDefault()
      const json = {
        pens: [{
          type: 0,
          rect: {x: 422, y: 97, width: 120, height: 40, center: {x: 482, y: 117}, ex: 542, ey: 137},
          lineWidth: 1,
          rotate: 0,
          offsetRotate: 0,
          globalAlpha: 1,
          dash: 0,
          strokeStyle: '#222',
          fillStyle: '',
          font: {
            color: '#222',
            fontFamily: '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial',
            fontSize: 12,
            lineHeight: 1.5,
            fontStyle: 'normal',
            fontWeight: 'normal',
            textAlign: 'center',
            textBaseline: 'middle'
          },
          animateCycleIndex: 0,
          events: [],
          eventFns: ['link', 'doAnimate', 'doFn', 'doWindowFn'],
          id: '1897230f',
          name: 'rectangle',
          tags: [],
          lineDashOffset: 0,
          text: '开始',
          textOffsetX: 0,
          textOffsetY: 0,
          animateType: '',
          visible: true,
          data: '',
          zRotate: 0,
          anchors: [{x: 422, y: 117, direction: 4}, {x: 482, y: 97, direction: 1}, {
            x: 542,
            y: 117,
            direction: 2
          }, {x: 482, y: 137, direction: 3}],
          rotatedAnchors: [{x: 422, y: 117, direction: 4}, {x: 482, y: 97, direction: 1}, {
            x: 542,
            y: 117,
            direction: 2
          }, {x: 482, y: 137, direction: 3}],
          animateDuration: 0,
          animateFrames: [],
          borderRadius: 0.5,
          iconSize: null,
          imageAlign: 'center',
          gradientAngle: 0,
          gradientRadius: 0.01,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingLeftNum: 0,
          paddingRightNum: 0,
          paddingTopNum: 0,
          paddingBottomNum: 0,
          textRect: {x: 462, y: 97, width: 80, height: 40, center: {x: 502, y: 117}, ex: 542, ey: 137},
          fullTextRect: {x: 422, y: 97, width: 120, height: 40, center: {x: 482, y: 117}, ex: 542, ey: 137},
          iconRect: {x: 422, y: 97, width: 40, height: 40, center: {x: 442, y: 117}, ex: 462, ey: 137},
          fullIconRect: {x: 422, y: 97, width: 120, height: 40, center: {x: 482, y: 117}, ex: 542, ey: 137},
          elementRendered: false,
          TID: '24f0673a',
          dockWatchers: [{x: 482, y: 117}, {x: 422, y: 97}, {x: 542, y: 97}, {x: 542, y: 137}, {x: 422, y: 137}]
        }, {
          type: 0,
          rect: {x: 424, y: 223, width: 120, height: 40, center: {x: 484, y: 243}, ex: 544, ey: 263},
          lineWidth: 1,
          rotate: 0,
          offsetRotate: 0,
          globalAlpha: 1,
          dash: 0,
          strokeStyle: '#222',
          fillStyle: '',
          font: {
            color: '#222',
            fontFamily: '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial',
            fontSize: 12,
            lineHeight: 1.5,
            fontStyle: 'normal',
            fontWeight: 'normal',
            textAlign: 'center',
            textBaseline: 'middle'
          },
          animateCycleIndex: 0,
          events: [],
          eventFns: ['link', 'doAnimate', 'doFn', 'doWindowFn'],
          id: 'fa3843f',
          name: 'rectangle',
          tags: [],
          lineDashOffset: 0,
          text: '流程',
          textOffsetX: 0,
          textOffsetY: 0,
          animateType: '',
          visible: true,
          data: '',
          zRotate: 0,
          anchors: [{x: 424, y: 243, direction: 4}, {x: 484, y: 223, direction: 1}, {
            x: 544,
            y: 243,
            direction: 2
          }, {x: 484, y: 263, direction: 3}],
          rotatedAnchors: [{x: 424, y: 243, direction: 4}, {x: 484, y: 223, direction: 1}, {
            x: 544,
            y: 243,
            direction: 2
          }, {x: 484, y: 263, direction: 3}],
          animateDuration: 0,
          animateFrames: [],
          borderRadius: 0,
          iconSize: null,
          imageAlign: 'center',
          gradientAngle: 0,
          gradientRadius: 0.01,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingLeftNum: 0,
          paddingRightNum: 0,
          paddingTopNum: 0,
          paddingBottomNum: 0,
          textRect: {x: 464, y: 223, width: 80, height: 40, center: {x: 504, y: 243}, ex: 544, ey: 263},
          fullTextRect: {x: 424, y: 223, width: 120, height: 40, center: {x: 484, y: 243}, ex: 544, ey: 263},
          iconRect: {x: 424, y: 223, width: 40, height: 40, center: {x: 444, y: 243}, ex: 464, ey: 263},
          fullIconRect: {x: 424, y: 223, width: 120, height: 40, center: {x: 484, y: 243}, ex: 544, ey: 263},
          elementRendered: false,
          TID: '24f0673a',
          dockWatchers: [{x: 484, y: 243}, {x: 424, y: 223}, {x: 544, y: 223}, {x: 544, y: 263}, {x: 424, y: 263}]
        }, {
          type: 1,
          rect: {x: 0, y: 0, width: 0, height: 0, center: {x: 0, y: 0}, ex: 0, ey: 0},
          lineWidth: 1,
          rotate: 0,
          offsetRotate: 0,
          globalAlpha: 1,
          dash: 0,
          strokeStyle: '#222',
          fillStyle: '',
          font: {
            color: '',
            fontFamily: '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial',
            fontSize: 12,
            lineHeight: 1.5,
            fontStyle: 'normal',
            fontWeight: 'normal',
            textAlign: 'center',
            textBaseline: 'middle',
            background: '#fff'
          },
          animateCycleIndex: 0,
          events: [],
          eventFns: ['link', 'doAnimate', 'doFn', 'doWindowFn'],
          id: '51d124',
          name: 'curve',
          tags: [],
          lineDashOffset: 0,
          textOffsetX: 0,
          textOffsetY: 0,
          visible: true,
          data: '',
          controlPoints: [{x: 482, y: 165, direction: 3, anchorIndex: 3, id: '1897230f'}, {
            x: 484,
            y: 195,
            direction: 1,
            anchorIndex: 1,
            id: 'fa3843f'
          }],
          fromArrowSize: 5,
          toArrowSize: 5,
          borderWidth: 0,
          borderColor: '#000000',
          animateColor: '',
          animateSpan: 1,
          animatePos: 0,
          isAnimate: false,
          animateFromSize: 0,
          animateToSize: 0,
          animateDotSize: 3,
          from: {x: 482, y: 137, direction: 3, anchorIndex: 3, id: '1897230f'},
          to: {x: 484, y: 223, direction: 1, anchorIndex: 1, id: 'fa3843f'},
          fromArrow: '',
          toArrow: 'triangleSolid',
          fromArrowColor: '#222',
          toArrowColor: '#222',
          textRect: null,
          TID: '24f0673a'
        }, {
          type: 0,
          rect: {x: 422, y: 351, width: 120, height: 60, center: {x: 482, y: 381}, ex: 542, ey: 411},
          lineWidth: 1,
          rotate: 0,
          offsetRotate: 0,
          globalAlpha: 1,
          dash: 0,
          strokeStyle: '#222',
          fillStyle: '',
          font: {
            color: '#222',
            fontFamily: '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial',
            fontSize: 12,
            lineHeight: 1.5,
            fontStyle: 'normal',
            fontWeight: 'normal',
            textAlign: 'center',
            textBaseline: 'middle'
          },
          animateCycleIndex: 0,
          events: [],
          eventFns: ['link', 'doAnimate', 'doFn', 'doWindowFn'],
          id: 'b2b10ce',
          name: 'diamond',
          tags: [],
          lineDashOffset: 0,
          text: '判定',
          textOffsetX: 0,
          textOffsetY: 0,
          animateType: '',
          visible: true,
          data: '',
          zRotate: 0,
          anchors: [{x: 422, y: 381, direction: 4}, {x: 482, y: 351, direction: 1}, {
            x: 542,
            y: 381,
            direction: 2
          }, {x: 482, y: 411, direction: 3}],
          rotatedAnchors: [{x: 422, y: 381, direction: 4}, {x: 482, y: 351, direction: 1}, {
            x: 542,
            y: 381,
            direction: 2
          }, {x: 482, y: 411, direction: 3}],
          animateDuration: 0,
          animateFrames: [],
          borderRadius: 0,
          iconSize: null,
          imageAlign: 'center',
          gradientAngle: 0,
          gradientRadius: 0.01,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingLeftNum: 0,
          paddingRightNum: 0,
          paddingTopNum: 0,
          paddingBottomNum: 0,
          textRect: {x: 462, y: 385, width: 40, height: 15, center: {x: 482, y: 392.5}, ex: 502, ey: 400},
          fullTextRect: {x: 452, y: 366, width: 60, height: 30, center: {x: 482, y: 381}, ex: 512, ey: 396},
          iconRect: {x: 472, y: 375, width: 20, height: 20, center: {x: 482, y: 385}, ex: 492, ey: 395},
          elementRendered: false,
          TID: '24f0673a',
          dockWatchers: [{x: 482, y: 381}, {x: 422, y: 351}, {x: 542, y: 351}, {x: 542, y: 411}, {x: 422, y: 411}]
        }, {
          type: 1,
          rect: {x: 0, y: 0, width: 0, height: 0, center: {x: 0, y: 0}, ex: 0, ey: 0},
          lineWidth: 1,
          rotate: 0,
          offsetRotate: 0,
          globalAlpha: 1,
          dash: 0,
          strokeStyle: '#222',
          fillStyle: '',
          font: {
            color: '',
            fontFamily: '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial',
            fontSize: 12,
            lineHeight: 1.5,
            fontStyle: 'normal',
            fontWeight: 'normal',
            textAlign: 'center',
            textBaseline: 'middle',
            background: '#fff'
          },
          animateCycleIndex: 0,
          events: [],
          eventFns: ['link', 'doAnimate', 'doFn', 'doWindowFn'],
          id: '89a485a',
          name: 'curve',
          tags: [],
          lineDashOffset: 0,
          textOffsetX: 0,
          textOffsetY: 0,
          visible: true,
          data: '',
          controlPoints: [{x: 484, y: 292, direction: 3, anchorIndex: 3, id: 'fa3843f'}, {
            x: 482,
            y: 322,
            direction: 1,
            anchorIndex: 1,
            id: 'b2b10ce'
          }],
          fromArrowSize: 5,
          toArrowSize: 5,
          borderWidth: 0,
          borderColor: '#000000',
          animateColor: '',
          animateSpan: 1,
          animatePos: 0,
          isAnimate: false,
          animateFromSize: 0,
          animateToSize: 0,
          animateDotSize: 3,
          from: {x: 484, y: 263, direction: 3, anchorIndex: 3, id: 'fa3843f'},
          to: {x: 482, y: 351, direction: 1, anchorIndex: 1, id: 'b2b10ce'},
          fromArrow: '',
          toArrow: 'triangleSolid',
          fromArrowColor: '#222',
          toArrowColor: '#222',
          textRect: null,
          TID: '24f0673a'
        }, {
          type: 0,
          rect: {x: 287, y: 530, width: 120, height: 50, center: {x: 347, y: 555}, ex: 407, ey: 580},
          lineWidth: 1,
          rotate: 0,
          offsetRotate: 0,
          globalAlpha: 1,
          dash: 0,
          strokeStyle: '#222',
          fillStyle: '',
          font: {
            color: '#222',
            fontFamily: '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial',
            fontSize: 12,
            lineHeight: 1.5,
            fontStyle: 'normal',
            fontWeight: 'normal',
            textAlign: 'center',
            textBaseline: 'middle'
          },
          animateCycleIndex: 0,
          events: [],
          eventFns: ['link', 'doAnimate', 'doFn', 'doWindowFn'],
          id: '7a3b0cd1',
          name: 'hexagon',
          tags: [],
          lineDashOffset: 0,
          text: '准备',
          textOffsetX: 0,
          textOffsetY: 0,
          animateType: '',
          visible: true,
          data: '',
          zRotate: 0,
          anchors: [{x: 347, y: 530, direction: 1}, {x: 407, y: 555, direction: 2}, {
            x: 347,
            y: 580,
            direction: 3
          }, {x: 287, y: 555, direction: 4}, {x: 299, y: 542.5, direction: 4, hidden: true}, {
            x: 299,
            y: 567.5,
            direction: 4,
            hidden: true
          }, {x: 395, y: 542.5, direction: 2, hidden: true}, {x: 395, y: 567.5, direction: 2, hidden: true}],
          rotatedAnchors: [{x: 347, y: 530, direction: 1}, {x: 407, y: 555, direction: 2}, {
            x: 347,
            y: 580,
            direction: 3
          }, {x: 287, y: 555, direction: 4}, {x: 299, y: 542.5, direction: 4, hidden: true}, {
            x: 299,
            y: 567.5,
            direction: 4,
            hidden: true
          }, {x: 395, y: 542.5, direction: 2, hidden: true}, {x: 395, y: 567.5, direction: 2, hidden: true}],
          animateDuration: 0,
          animateFrames: [],
          borderRadius: 0,
          iconSize: null,
          imageAlign: 'center',
          gradientAngle: 0,
          gradientRadius: 0.01,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingLeftNum: 0,
          paddingRightNum: 0,
          paddingTopNum: 0,
          paddingBottomNum: 0,
          textRect: {x: 311, y: 567.5, width: 72, height: 12.5, center: {x: 347, y: 573.75}, ex: 383, ey: 580},
          fullTextRect: {x: 311, y: 530, width: 72, height: 50, center: {x: 347, y: 555}, ex: 383, ey: 580},
          iconRect: {x: 311, y: 530, width: 72, height: 37.5, center: {x: 347, y: 548.75}, ex: 383, ey: 567.5},
          fullIconRect: {x: 311, y: 530, width: 72, height: 50, center: {x: 347, y: 555}, ex: 383, ey: 580},
          elementRendered: false,
          TID: '24f0673a'
        }, {
          type: 1,
          rect: {x: 0, y: 0, width: 0, height: 0, center: {x: 0, y: 0}, ex: 0, ey: 0},
          lineWidth: 1,
          rotate: 0,
          offsetRotate: 0,
          globalAlpha: 1,
          dash: 0,
          strokeStyle: '#222',
          fillStyle: '',
          font: {
            color: '',
            fontFamily: '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial',
            fontSize: 12,
            lineHeight: 1.5,
            fontStyle: 'normal',
            fontWeight: 'normal',
            textAlign: 'center',
            textBaseline: 'middle',
            background: '#fff'
          },
          animateCycleIndex: 0,
          events: [],
          eventFns: ['link', 'doAnimate', 'doFn', 'doWindowFn'],
          id: '78d90643',
          name: 'polyline',
          tags: [],
          lineDashOffset: 0,
          textOffsetX: 0,
          textOffsetY: 0,
          visible: true,
          data: '',
          controlPoints: [{x: 385, y: 381, direction: 4, anchorIndex: 0, id: 'b2b10ce'}, {x: 347, y: 381}, {
            x: 347,
            y: 456,
            direction: 1,
            anchorIndex: 0,
            id: '7a3b0cd1'
          }],
          fromArrowSize: 5,
          toArrowSize: 5,
          borderWidth: 0,
          borderColor: '#000000',
          animateColor: '',
          animateSpan: 1,
          animatePos: 0,
          isAnimate: false,
          animateFromSize: 0,
          animateToSize: 0,
          animateDotSize: 3,
          from: {x: 422, y: 381, direction: 4, anchorIndex: 0, id: 'b2b10ce'},
          to: {x: 347, y: 530, direction: 1, anchorIndex: 0, id: '7a3b0cd1'},
          fromArrow: '',
          toArrow: 'triangleSolid',
          fromArrowColor: '#222',
          toArrowColor: '#222',
          textRect: null,
          TID: '24f0673a'
        }, {
          type: 0,
          rect: {x: 435, y: 626, width: 120, height: 50, center: {x: 495, y: 651}, ex: 555, ey: 676},
          lineWidth: 1,
          rotate: 0,
          offsetRotate: 0,
          globalAlpha: 1,
          dash: 0,
          strokeStyle: '#222',
          fillStyle: '',
          font: {
            color: '#222',
            fontFamily: '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial',
            fontSize: 12,
            lineHeight: 1.5,
            fontStyle: 'normal',
            fontWeight: 'normal',
            textAlign: 'center',
            textBaseline: 'middle'
          },
          animateCycleIndex: 0,
          events: [],
          eventFns: ['link', 'doAnimate', 'doFn', 'doWindowFn'],
          id: '5f2b4aa3',
          name: 'flowData',
          tags: [],
          lineDashOffset: 0,
          text: '数据',
          textOffsetX: 0,
          textOffsetY: 0,
          animateType: '',
          visible: true,
          data: '',
          zRotate: 0,
          anchors: [{x: 443.57142857142856, y: 651, direction: 4}, {
            x: 503.57142857142856,
            y: 626,
            direction: 1
          }, {x: 546.4285714285714, y: 651, direction: 2}, {x: 486.42857142857144, y: 676, direction: 3}],
          rotatedAnchors: [{x: 443.57142857142856, y: 651, direction: 4}, {
            x: 503.57142857142856,
            y: 626,
            direction: 1
          }, {x: 546.4285714285714, y: 651, direction: 2}, {x: 486.42857142857144, y: 676, direction: 3}],
          animateDuration: 0,
          animateFrames: [],
          borderRadius: 0,
          iconSize: null,
          imageAlign: 'center',
          gradientAngle: 0,
          gradientRadius: 0.01,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingLeftNum: 0,
          paddingRightNum: 0,
          paddingTopNum: 0,
          paddingBottomNum: 0,
          textRect: {
            x: 452.14285714285717,
            y: 626,
            width: 85.71428571428571,
            height: 50,
            center: {x: 495, y: 651},
            ex: 537.8571428571429,
            ey: 676
          },
          fullTextRect: {
            x: 452.14285714285717,
            y: 626,
            width: 85.71428571428571,
            height: 50,
            center: {x: 495, y: 651},
            ex: 537.8571428571429,
            ey: 676
          },
          iconRect: {x: 0, y: 0, width: 0, height: 0, center: {x: 0, y: 0}, ex: 0, ey: 0},
          elementRendered: false,
          TID: '24f0673a'
        }, {
          type: 1,
          rect: {x: 0, y: 0, width: 0, height: 0, center: {x: 0, y: 0}, ex: 0, ey: 0},
          lineWidth: 1,
          rotate: 0,
          offsetRotate: 0,
          globalAlpha: 1,
          dash: 0,
          strokeStyle: '#222',
          fillStyle: '',
          font: {
            color: '',
            fontFamily: '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial',
            fontSize: 12,
            lineHeight: 1.5,
            fontStyle: 'normal',
            fontWeight: 'normal',
            textAlign: 'center',
            textBaseline: 'middle',
            background: '#fff'
          },
          animateCycleIndex: 0,
          events: [],
          eventFns: ['link', 'doAnimate', 'doFn', 'doWindowFn'],
          id: 'da1bb62',
          name: 'polyline',
          tags: [],
          lineDashOffset: 0,
          textOffsetX: 0,
          textOffsetY: 0,
          visible: true,
          data: '',
          controlPoints: [{x: 622, y: 381, direction: 2, anchorIndex: 2, id: 'b2b10ce'}, {
            x: 626.4285714285714,
            y: 651,
            direction: 2,
            anchorIndex: 2,
            id: '5f2b4aa3'
          }],
          fromArrowSize: 5,
          toArrowSize: 5,
          borderWidth: 0,
          borderColor: '#000000',
          animateColor: '',
          animateSpan: 1,
          animatePos: 0,
          isAnimate: false,
          animateFromSize: 0,
          animateToSize: 0,
          animateDotSize: 3,
          from: {x: 542, y: 381, direction: 2, anchorIndex: 2, id: 'b2b10ce'},
          to: {x: 546.4285714285714, y: 651, direction: 2, anchorIndex: 2, id: '5f2b4aa3'},
          fromArrow: '',
          toArrow: 'triangleSolid',
          fromArrowColor: '#222',
          toArrowColor: '#222',
          textRect: null,
          TID: '24f0673a'
        }],
        lineName: 'curve',
        fromArrowType: '',
        toArrowType: 'triangleSolid',
        scale: 1,
        locked: 1,
        mqttOptions: {clientId: 'd248fe2'}
      }
      iTopologyData.value.locked = json.locked === 1
      canvas.open(json)
    };
    const onRootChange = (e) => {
      iTopologyData.value.locked = e.target.value
      // canvas.data.locked = e.target.value
      canvas.lock(e.target.value ? 1 : 0)
      canvas.render()
    };
    const handleLinenameChange = (value) => {
      canvas.data.lineName = value
      canvas.render()
    };
    const handlefromArrowChange = (value) => {
      canvas.data.fromArrowType = value
      canvas.render()
    };
    const handletoArrowChange = (value) => {
      canvas.data.toArrowType = value
      canvas.render()
    };
    const onUpdateProps = (node) => {
      canvas.updateProps(node)
    };
    onMounted(() => {
      registerFlow();
      init();
    });

    return {
      iTools: Tools,
      lineNames,
      arrowTypes,
      iProps,
      contextmenu,
      canvasData,
      iTopologyData,
      onDrag,
      onContextMenu,
      onUpdateProps,
      handleMenuClick,
      onRootChange,
      handleLinenameChange,
      handlefromArrowChange,
      handletoArrowChange,
      handleConsoleClick,
      handlePreviewClick,
      onSwitchChange
    };
  }
});
</script>

<style lang="scss">
.topology {
  display: flex;
  width: 100%;
  height: 100vh;
  // 左侧图形库
  .tools {
    flex-shrink: 0;
    width: 175px;
    background-color: #f8f8f8;
    border-right: 1px solid #d9d9d9;
    overflow-y: auto;
    overflow-X: hidden;

    .title {
      color: #0d1a26;
      font-weight: 600;
      font-size: 12px;
      line-height: 1;
      padding: 5px 10px;
      margin-top: 8px;
      border-bottom: 1px solid #ddd;

      &:first-child {
        border-top: none;
      }
    }

    .buttons {
      padding: 10px 0;

      a {
        display: inline-block;
        color: #314659;
        line-height: 1;
        width: 40px;
        height: 40px;
        text-align: center;
        text-decoration: none !important;
        cursor: pointer;

        .iconfont {
          font-size: 24px;
        }

        &:hover {
          color: #1890ff;
        }
      }
    }
  }

  // 画布
  .full {
    flex: 1;
    width: initial;
    position: relative;
    overflow: auto;
    background: #fff;
  }

  // 右侧属性栏
  .props {
    width: 260px;
    padding: 10px 0;
    background-color: #f8f8f8;
    border-left: 1px solid #d9d9d9;
    overflow-y: auto;
    overflow-X: hidden;
    position: relative;
    font-size: 14px;
    color: #000;
    // 公共样式
    .title {
      color: #0d1a26;
      font-weight: 600;
      font-size: 12px;
      padding: 5px 15px;
      border-bottom: 1px solid #ccc;
    }

    .settings {
      padding: 8px 15px;

      .item {
        width: 100%;
        margin: 8px 0;
        display: flex;
        align-items: center;

        .label {
          width: 100px;
        }

        &.select {
          .ant-select {
            flex: 1;
            display: flex;

            /deep/ .ant-select-selection {
              width: 100%;
            }
          }
        }
      }
    }

    // 小提示
    .bottom {
      position: absolute;
      left: 0;
      bottom: 0;

      .group {
        padding: 8px 15px;
        font-size: 12px;
        list-style-type: disc;
        list-style-position: inside;

        li {
          line-height: 24px;
        }
      }
    }

    .row-layout {
      color: #595959;
      padding: 3px 15px;

      .ant-col {
        margin-top: 5px;
      }

      .bable {
        font-size: 12px;
        height: 24px;
        line-height: 24px;
      }

      .bable-content {
      }
    }
  }

  // 颜色选择器
  .color-picker.m-el-color-picker {
    /deep/ .box {
      width: 215px !important;
    }

    /deep/ .colorBtn {
      cursor: pointer;
    }
  }
  .canvas-container {
    background-image: linear-gradient(45deg,#f4f4f5 25%,rgba(255,0,0,0) 25%),linear-gradient(135deg,#f4f4f5 25%,rgba(0,0,0,0) 25%),linear-gradient(45deg,rgba(0,0,0,0) 75%,#f4f4f5 75%),linear-gradient(135deg,rgba(0,0,0,0) 75%,#f4f4f5 75%);
    background-size: 20px 20px;
    background-position: 0px 0px,10px 0px,10px -10px,0px 10px;
  }
}
</style>
