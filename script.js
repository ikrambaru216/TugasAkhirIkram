(function(){
var KEY="lf-sekolah-v2",ICON={"Tas & Alat Tulis":"🎒","Elektronik":"🎧","Pakaian":"🧥","Botol & Bekal":"🥤","Kunci & Dompet":"🔑","Buku":"📚","Lainnya":"📦"},CATS=Object.keys(ICON);
var seed=[
{id:1,type:"lost",name:"Botol minum biru",cat:"Botol & Bekal",date:"2026-10-20",place:"Kantin",desc:"Merek Tupperware, ada stiker bintang di tutup.",who:"Rani, XI IPA 2",contact:"0812-0000-1111",done:false},
{id:2,type:"found",name:"Jaket almamater",cat:"Pakaian",date:"2026-10-21",place:"Lapangan basket",desc:"Ukuran L, ada inisial di label dalam.",who:"Pak Andi (piket)",contact:"Ruang guru",done:false},
{id:3,type:"found",name:"Kalkulator ilmiah",cat:"Elektronik",date:"2026-10-22",place:"Lab Fisika",desc:"Casio fx-991, ada goresan di sisi kanan.",who:"Dita, X-3",contact:"0813-0000-2222",done:false},
{id:4,type:"lost",name:"Kunci motor",cat:"Kunci & Dompet",date:"2026-10-19",place:"Parkiran",desc:"Gantungan karakter kucing.",who:"Bima, XII IPS 1",contact:"0857-0000-3333",done:true},
{id:5,type:"lost",name:"Buku catatan Matematika",cat:"Buku",date:"2026-10-22",place:"Perpustakaan",desc:"Sampul hijau, nama di halaman pertama.",who:"Salsa, XI IPS 2",contact:"0821-0000-4444",done:false}];
var items=load(),type="all",cat="Semua",term="",photo="";
function load(){try{var r=localStorage.getItem(KEY);if(r)return JSON.parse(r)}catch(e){}return seed.slice()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(items))}catch(e){toast("Penyimpanan penuh, foto mungkin terlalu besar")}}
var $=function(s){return document.querySelector(s)};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function fdt(d){try{return new Date(d+"T00:00:00").toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}catch(e){return d}}
function toast(m){var t=$("#toast");t.textContent=m;t.classList.add("on");setTimeout(function(){t.classList.remove("on")},2400)}
try{var sn=localStorage.getItem("lf-school");if(sn)$("#school").textContent="🎒 Lost & Found · "+sn}catch(e){}
$("#school").addEventListener("click",function(){var n=prompt("Nama sekolah:");if(n&&n.trim()){$("#school").textContent="🎒 Lost & Found · "+n.trim();try{localStorage.setItem("lf-school",n.trim())}catch(e){}}});
$("#cs").innerHTML=CATS.map(function(c){return"<option>"+esc(c)+"</option>"}).join("");
function drawCats(){$("#cats").innerHTML=["Semua"].concat(CATS).map(function(c){return'<button class="chip" data-c="'+esc(c)+'" aria-pressed="'+(c===cat)+'">'+(ICON[c]||"✨")+" "+esc(c)+"</button>"}).join("")}
function render(){
  var open=items.filter(function(i){return!i.done});
  $("#stats").innerHTML='<span><b>'+open.filter(function(i){return i.type==="lost"}).length+'</b>masih dicari</span><span><b>'+open.filter(function(i){return i.type==="found"}).length+'</b>menunggu pemilik</span><span><b>'+items.filter(function(i){return i.done}).length+'</b>sudah kembali</span>';
  var l=items.filter(function(i){
    if(type!=="all"&&i.type!==type)return false;
    if(cat!=="Semua"&&i.cat!==cat)return false;
    if(term&&(i.name+" "+i.place+" "+i.desc+" "+i.cat).toLowerCase().indexOf(term)<0)return false;
    return true}).sort(function(a,b){return (a.done-b.done)||(b.date<a.date?-1:b.date>a.date?1:b.id-a.id)});
  $("#list").innerHTML=l.length?l.map(function(i){
    return'<button class="card '+i.type+(i.done?" done":"")+'" data-id="'+i.id+'"><div class="ph">'+(i.img?'<img src="'+i.img+'" alt="'+esc(i.name)+'">':(ICON[i.cat]||"📦"))+'<span class="bd">'+(i.type==="lost"?"Hilang":"Ditemukan")+'</span></div><div class="ct"><h3>'+esc(i.name)+'</h3><p>'+esc(i.place)+' · '+fdt(i.date)+'</p></div></button>'}).join(""):'<div class="empty">Belum ada laporan yang cocok. Coba kata kunci lain, atau buat laporan baru.</div>';
}
function wa(c){var d=c.replace(/\D/g,"");if(d.length<9)return"";if(d[0]==="0")d="62"+d.slice(1);return"https://wa.me/"+d}
function detail(id){
  var i=items.filter(function(x){return x.id===id})[0];if(!i)return;
  var w=wa(i.contact);
  $("#dc").className="dp "+i.type;
  $("#dc").innerHTML='<div class="dimg ph">'+(i.img?'<img src="'+i.img+'" alt="'+esc(i.name)+'">':(ICON[i.cat]||"📦"))+'<span class="bd">'+(i.type==="lost"?"Hilang":"Ditemukan")+'</span></div><h2>'+esc(i.name)+'</h2><div class="dl"><span><b>Kategori:</b> '+esc(i.cat)+'</span><span><b>Lokasi:</b> '+esc(i.place)+'</span><span><b>Tanggal:</b> '+fdt(i.date)+'</span>'+(i.desc?'<span><b>Ciri-ciri:</b> '+esc(i.desc)+'</span>':'')+'<span><b>Pelapor:</b> '+esc(i.who)+'</span><span><b>Kontak:</b> '+esc(i.contact)+'</span></div><div class="fa">'+(w?'<a class="b sm found" style="text-decoration:none" target="_blank" rel="noopener" href="'+w+'">Hubungi lewat WhatsApp</a>':'')+(i.done?'':'<button class="b sm" data-a="done" data-id="'+i.id+'">'+(i.type==="lost"?"Sudah ketemu":"Sudah diambil pemilik")+'</button>')+'<button class="b o sm" data-a="del" data-id="'+i.id+'">Hapus</button><button class="b o sm" data-a="x">Tutup</button></div>';
  $("#dd").showModal();
}
$("#list").addEventListener("click",function(e){var c=e.target.closest(".card");if(c)detail(+c.dataset.id)});
$("#dc").addEventListener("click",function(e){
  var b=e.target.closest("button[data-a]");if(!b)return;var id=+b.dataset.id,a=b.dataset.a;
  if(a==="x"){$("#dd").close();return}
  if(a==="done"){items.forEach(function(i){if(i.id===id)i.done=true});toast("Ditandai sudah kembali")}
  if(a==="del"){if(!confirm("Hapus laporan ini?"))return;items=items.filter(function(i){return i.id!==id});toast("Laporan dihapus")}
  save();$("#dd").close();render()});
$("#tabs").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;type=b.dataset.t;document.querySelectorAll("#tabs button").forEach(function(x){x.setAttribute("aria-pressed",x===b)});render()});
$("#cats").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;cat=b.dataset.c;drawCats();render()});
$("#q").addEventListener("input",function(e){term=e.target.value.trim().toLowerCase();render()});
var fd=$("#fd");
function openForm(t){$("#f").reset();photo="";$("#prev").style.display="none";$("#f").date.value=new Date().toISOString().slice(0,10);$("#f").type.value=t||"lost";fd.showModal()}
document.querySelectorAll("[data-new]").forEach(function(b){b.addEventListener("click",function(){openForm(b.dataset.new)})});
$("#cx").addEventListener("click",function(){fd.close()});
$("#photo").addEventListener("change",function(e){
  var f=e.target.files[0];if(!f)return;var r=new FileReader();
  r.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,640/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*s;c.height=im.height*s;c.getContext("2d").drawImage(im,0,0,c.width,c.height);photo=c.toDataURL("image/jpeg",.72);var p=$("#prev");p.src=photo;p.style.display="block"};im.src=r.result};
  r.readAsDataURL(f)});
$("#f").addEventListener("submit",function(e){
  e.preventDefault();var f=e.target;
  items.push({id:Date.now(),type:f.type.value,name:f.name.value.trim(),cat:f.cat.value,date:f.date.value,place:f.place.value.trim(),desc:f.desc.value.trim(),who:f.who.value.trim(),contact:f.contact.value.trim(),img:photo,done:false});
  save();fd.close();render();toast("Laporan tersimpan")});
$("#theme").addEventListener("click",function(){var r=document.documentElement,d=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=d?"light":"dark"});
drawCats();render();
})();